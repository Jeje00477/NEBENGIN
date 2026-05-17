<?php

namespace App\Http\Controllers;

use App\Models\DriverProfile;
use App\Models\RiderRequest;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function profile(Request $request)
    {
        $profile = DriverProfile::where('driver_id', $request->user()->id)->first();

        if (!$profile) {
            return response()->json(null);
        }

        return response()->json([
            'is_available' => (bool)$profile->is_available,
            'vehicle' => [
                'merk_kendaraan' => $profile->vehicle_merk,
                'nomor_polisi' => $profile->vehicle_plat_nomor,
                'warna_kendaraan' => $profile->vehicle_warna,
                'jenis_kendaraan' => $profile->vehicle_jenis,
                'kapasitas_kursi' => $profile->kapasitas_kursi,
            ],
            'stats' => [
                'rating' => (float)$profile->rating,
                'total_trips' => (int)$profile->total_trips,
            ]
        ]);
    }

    public function saveVehicle(Request $request)
    {
        $request->validate([
            'jenis_kendaraan'  => 'nullable|string',
            'merk_kendaraan'   => 'required|string',
            'warna_kendaraan'  => 'required|string',
            'nomor_polisi'     => 'required|string',
            'kapasitas_kursi'  => 'nullable|integer'
        ]);

        $profile = DriverProfile::updateOrCreate(
            ['driver_id' => $request->user()->id],
            [
                'vehicle_jenis'      => $request->jenis_kendaraan,
                'vehicle_merk'       => $request->merk_kendaraan,
                'vehicle_warna'      => $request->warna_kendaraan,
                'vehicle_plat_nomor' => $request->nomor_polisi,
                'kapasitas_kursi'    => $request->kapasitas_kursi,
            ]
        );

        return response()->json([
            'is_available' => (bool)$profile->is_available,
            'vehicle' => [
                'merk_kendaraan' => $profile->vehicle_merk,
                'nomor_polisi' => $profile->vehicle_plat_nomor,
                'warna_kendaraan' => $profile->vehicle_warna,
                'jenis_kendaraan' => $profile->vehicle_jenis,
                'kapasitas_kursi' => $profile->kapasitas_kursi,
            ],
            'stats' => [
                'rating' => (float)$profile->rating,
                'total_trips' => (int)$profile->total_trips,
            ]
        ]);
    }

    public function toggleAvailability(Request $request)
    {
        $profile = DriverProfile::where('driver_id', $request->user()->id)->firstOrFail();
        $profile->is_available = !$profile->is_available;
        $profile->save();

        return response()->json(['success' => true, 'is_available' => $profile->is_available]);
    }

    public function searchRiders(Request $request)
    {
        $requests = RiderRequest::with('rider')
            ->where('status', 'waiting')
            ->where('expires_at', '>', now())
            ->get()
            ->map(function ($req) {
                return [
                    'request_id' => $req->id,
                    'rider_id' => $req->rider->id,
                    'rider_nama' => $req->rider->nama,
                    'rider_avatar' => $req->rider->avatar_url,
                    'rider_avg_rating' => 5.0, // Should be calculated if rider profile has rating
                    'rider_nomor_wa' => $req->rider->nomor_wa,
                    'pickup_lat' => $req->pickup_lat,
                    'pickup_lng' => $req->pickup_lng,
                    'lokasi_jemput_label' => $req->lokasi_jemput_label,
                    'destination_lat' => $req->destination_lat,
                    'destination_lng' => $req->destination_lng,
                    'tujuan_label' => $req->tujuan_label,
                ];
            });

        return response()->json($requests);
    }

    public function confirmPickup(Request $request)
    {
        $request->validate([
            'riderRequestIds' => 'required|array'
        ]);

        $tripIds = [];

        DB::transaction(function () use ($request, &$tripIds) {
            foreach ($request->riderRequestIds as $reqId) {
                $riderReq = RiderRequest::where('id', $reqId)->where('status', 'waiting')->lockForUpdate()->first();
                if ($riderReq) {
                    $riderReq->status = 'matched';
                    $riderReq->driver_id = $request->user()->id;
                    $riderReq->cancel_deadline = now()->addSeconds(60);
                    $riderReq->save();

                    $trip = Trip::create([
                        'request_id' => $riderReq->id,
                        'driver_id' => $request->user()->id,
                        'rider_id' => $riderReq->rider_id,
                        'status' => 'on_the_way',
                        'route_label' => "{$riderReq->lokasi_jemput_label} -> {$riderReq->tujuan_label}",
                    ]);

                    $tripIds[] = $trip->id;
                }
            }
        });

        return response()->json(['tripIds' => $tripIds]);
    }

    public function history(Request $request)
    {
        $trips = Trip::with(['rider', 'request'])
            ->where('driver_id', $request->user()->id)
            ->where('status', 'selesai')
            ->orderBy('completed_at', 'desc')
            ->get();

        return response()->json($trips);
    }
}
