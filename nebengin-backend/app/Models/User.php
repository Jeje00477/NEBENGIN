<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'nomor_wa',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
    ];

    public function driverProfile()
    {
        return $this->hasOne(DriverProfile::class, 'driver_id');
    }

    public function riderRequests()
    {
        return $this->hasMany(RiderRequest::class, 'rider_id');
    }

    public function tripsAsDriver()
    {
        return $this->hasMany(Trip::class, 'driver_id');
    }

    public function tripsAsRider()
    {
        return $this->hasMany(Trip::class, 'rider_id');
    }
}
