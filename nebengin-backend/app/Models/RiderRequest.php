<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiderRequest extends Model
{
    protected $table = 'rider_requests';

    protected $fillable = [
        'rider_id',
        'driver_id',
        'pickup_lat',
        'pickup_lng',
        'lokasi_jemput_label',
        'destination_lat',
        'destination_lng',
        'tujuan_label',
        'status',
        'expires_at',
        'cancel_deadline'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'cancel_deadline' => 'datetime',
    ];

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function trip()
    {
        return $this->hasOne(Trip::class, 'request_id');
    }
}
