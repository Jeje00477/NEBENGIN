<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $table = 'trips';

    protected $fillable = [
        'request_id',
        'driver_id',
        'rider_id',
        'status',
        'route_label',
        'rating_for_driver',
        'rating_for_rider',
        'komentar_for_driver',
        'komentar_for_rider',
        'started_at',
        'completed_at'
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function request()
    {
        return $this->belongsTo(RiderRequest::class, 'request_id');
    }
}
