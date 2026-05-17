<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverProfile extends Model
{
    protected $table = 'driver_profiles';

    protected $fillable = [
        'driver_id',
        'is_available',
        'vehicle_merk',
        'vehicle_plat_nomor',
        'vehicle_warna',
        'vehicle_jenis',
        'kapasitas_kursi',
        'rating',
        'total_trips'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
