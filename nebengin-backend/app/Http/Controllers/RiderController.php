<?php

namespace App\Http\Controllers;

use App\Models\RiderRequest;
use App\Models\Trip;
use Illuminate\Http\Request;

class RiderController extends Controller
{
    public function createRequest(Request $request)
    {
        $request->validate([
            'pickup_lat' => 'required|numeric',
            'pickup_lng' => 'required|numeric',
            'lokasi_jemput_label' => 'required|string',
            'destination_lat' => 'required|numeric',
            'destination_lng' => 'required|numeric',
            'tujuan_label' => 'required|string',
        ]);

        RiderRequest::where('rider_id', $request->user()->id)
            ->where('status', 'waiting')
            ->update(['status' => 'cancelled']);

        $riderReq = RiderRequest::create([
            'rider_id' => $request->user()->id,
            'pickup_lat' => $request->pickup_lat,
            'pickup_lng' => $request->pickup_lng,
            'lokasi_jemput_label' => $request->lokasi_jemput_label,
            'destination_lat' => $request->destination_lat,
            'destination_lng' => $request->destination_lng,
            'tujuan_label' => $request->tujuan_label,
            'status' => 'waiting',
            'expires_at' => now()->addMinutes(5),
        ]);

        return response()->json(['requestId' => $riderReq->id]);
    }

    public function pollStatus(Request $request)
    {
        $riderReq = RiderRequest::with(['driver.driverProfile'])
            ->where('rider_id', $request->user()->id)
            ->whereIn('status', ['waiting', 'matched'])
            ->orderBy('id', 'desc')
            ->first();

        if (!$riderReq) {
            return response()->json(['status' => 'none']);
        }

        if ($riderReq->status === 'waiting') {
            if ($riderReq->expires_at && $riderReq->expires_at <= now()) {
                $riderReq->status = 'cancelled';
                $riderReq->save();
                return response()->json(['status' => 'timeout']);
            }
            return response()->json(['status' => 'waiting']);
        }

        if ($riderReq->status === 'matched') {
            $driver = $riderReq->driver;
            $profile = $driver->driverProfile;
            return response()->json([
                'status' => 'matched',
                'cancel_deadline' => $riderReq->cancel_deadline,
                'driver' => [
                    'nama' => $driver->nama,
                    'avatar_url' => $driver->avatar_url,
                    'nomor_wa' => $driver->nomor_wa,
                    'vehicle' => $profile ? [
                        'jenis_kendaraan' => $profile->vehicle_jenis,
                        'merk_kendaraan' => $profile->vehicle_merk,
                        'warna_kendaraan' => $profile->vehicle_warna,
                        'nomor_polisi' => $profile->vehicle_plat_nomor,
                        'kapasitas_kursi' => $profile->kapasitas_kursi,
                    ] : null,
                ]
            ]);
        }

        return response()->json(['status' => 'none']);
    }

    public function cancelRequest(Request $request, $id)
    {
        $riderReq = RiderRequest::where('id', $id)
            ->where('rider_id', $request->user()->id)
            ->firstOrFail();

        if ($riderReq->status === 'matched') {
            if ($riderReq->cancel_deadline && now() > $riderReq->cancel_deadline) {
                return response()->json(['message' => 'Waktu pembatalan sudah habis'], 403);
            }
        }

        $riderReq->status = 'cancelled';
        $riderReq->save();

        Trip::where('request_id', $riderReq->id)
            ->whereIn('status', ['on_the_way', 'picked_up'])
            ->update(['status' => 'cancelled']);

        return response()->json(['success' => true]);
    }

    public function activeTrip(Request $request)
    {
        $trip = Trip::with(['driver.driverProfile'])
            ->where('rider_id', $request->user()->id)
            ->whereIn('status', ['on_the_way', 'picked_up'])
            ->first();

        if (!$trip) {
            return response()->json(null);
        }

        $driver = $trip->driver;
        $profile = $driver->driverProfile;

        return response()->json([
            'id' => $trip->id,
            'status' => $trip->status,
            'driver' => [
                'id' => $driver->id,
                'nama' => $driver->nama,
                'avatar_url' => $driver->avatar_url,
                'nomor_wa' => $driver->nomor_wa,
                'vehicle' => $profile ? [
                    'jenis_kendaraan' => $profile->vehicle_jenis,
                    'merk_kendaraan' => $profile->vehicle_merk,
                    'warna_kendaraan' => $profile->vehicle_warna,
                    'nomor_polisi' => $profile->vehicle_plat_nomor,
                    'kapasitas_kursi' => $profile->kapasitas_kursi,
                ] : null,
            ]
        ]);
    }

    public function history(Request $request)
    {
        $trips = Trip::with(['driver', 'request'])
            ->where('rider_id', $request->user()->id)
            ->whereIn('status', ['selesai', 'cancelled'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($trip) {
                return [
                    'id' => $trip->id,
                    'date' => $trip->completed_at ?? $trip->created_at,
                    'route_label' => $trip->route_label,
                    'status' => $trip->status === 'cancelled' ? 'dibatalkan' : $trip->status,
                    'driver_name' => $trip->driver->nama ?? 'Tidak Ada',
                    'rating_given' => $trip->rating_for_driver,
                ];
            });

        return response()->json($trips);
    }
}
