<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\RiderController;
use App\Http\Controllers\TripController;

// Public routes (no auth needed)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Protected routes (require Sanctum token)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout',     [AuthController::class, 'logout']);
    Route::get ('/auth/me',         [AuthController::class, 'me']);
    Route::put ('/users/profile',   [AuthController::class, 'updateProfile']);
    Route::put ('/users/change-password', [AuthController::class, 'changePassword']);

    // Driver
    Route::get ('/driver/profile',              [DriverController::class, 'profile']);
    Route::put ('/driver/vehicle',              [DriverController::class, 'saveVehicle']);
    Route::post('/driver/toggle-availability',  [DriverController::class, 'toggleAvailability']);
    Route::get ('/driver/search-riders',        [DriverController::class, 'searchRiders']);
    Route::post('/driver/confirm-pickup',       [DriverController::class, 'confirmPickup']);
    Route::get ('/driver/history',              [DriverController::class, 'history']);

    // Rider
    Route::post('/rider/requests',          [RiderController::class, 'createRequest']);
    Route::get ('/rider/requests/status',   [RiderController::class, 'pollStatus']);
    Route::post('/rider/requests/{id}/cancel', [RiderController::class, 'cancelRequest']);
    Route::get ('/rider/trips/active',      [RiderController::class, 'activeTrip']);
    Route::get ('/rider/history',           [RiderController::class, 'history']);

    // Trips (shared)
    Route::post('/trips/{tripId}/pickup',   [TripController::class, 'markPickedUp']);
    Route::post('/trips/{tripId}/complete', [TripController::class, 'complete']);
    Route::get ('/trips/{tripId}',          [TripController::class, 'detail']);
    Route::post('/trips/{tripId}/rating',   [TripController::class, 'submitRating']);
});
