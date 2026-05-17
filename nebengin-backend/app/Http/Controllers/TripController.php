<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\DriverProfile;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function markPickedUp(Request $request, $tripId)
    {
        $trip = Trip::where('id', $tripId)->where('driver_id', $request->user()->id)->firstOrFail();
        $trip->status = 'picked_up';
        $trip->save();

        return response()->json(['success' => true]);
    }

    public function complete(Request $request, $tripId)
    {
        $trip = Trip::where('id', $tripId)->where('driver_id', $request->user()->id)->firstOrFail();
        $trip->status = 'selesai';
        $trip->completed_at = now();
        $trip->save();

        DriverProfile::where('driver_id', $request->user()->id)->increment('total_trips');

        return response()->json(['success' => true]);
    }

    public function detail(Request $request, $tripId)
    {
        $trip = Trip::with(['driver', 'rider', 'request'])->findOrFail($tripId);
        
        if ($trip->driver_id !== $request->user()->id && $trip->rider_id !== $request->user()->id) {
            abort(403);
        }

        $user = $request->user();
        $formatted = [
            'id' => $trip->id,
            'date' => $trip->completed_at ?? $trip->created_at,
            'route_label' => $trip->route_label,
            'status' => $trip->status === 'cancelled' ? 'dibatalkan' : $trip->status,
        ];

        if ($user->role === 'driver') {
            $formatted['riders'] = [
                [
                    'nama' => $trip->rider->nama,
                    'avatar_url' => $trip->rider->avatar_url,
                    'rating_received' => $trip->rating_for_rider,
                ]
            ];
        } else {
            $formatted['driver'] = [
                'nama' => $trip->driver->nama ?? 'Tidak Ada',
                'avatar_url' => $trip->driver->avatar_url ?? null,
                'rating_given' => $trip->rating_for_driver,
            ];
        }

        return response()->json($formatted);
    }

    public function submitRating(Request $request, $tripId)
    {
        $request->validate([
            'nilai' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string',
            'arah_rating' => 'required|in:driver_to_rider,rider_to_driver',
        ]);

        $trip = Trip::findOrFail($tripId);

        if ($trip->status !== 'selesai') {
            return response()->json(['message' => 'Trip belum selesai'], 400);
        }

        if ($request->arah_rating === 'rider_to_driver') {
            if ($trip->rider_id !== $request->user()->id) abort(403);
            
            $trip->rating_for_driver = $request->nilai;
            $trip->komentar_for_driver = $request->komentar;
            $trip->save();

            // Recalculate driver rating
            $avg = Trip::where('driver_id', $trip->driver_id)->whereNotNull('rating_for_driver')->avg('rating_for_driver');
            DriverProfile::where('driver_id', $trip->driver_id)->update(['rating' => $avg]);

        } else {
            if ($trip->driver_id !== $request->user()->id) abort(403);

            $trip->rating_for_rider = $request->nilai;
            $trip->komentar_for_rider = $request->komentar;
            $trip->save();
        }

        return response()->json(['success' => true]);
    }
}
