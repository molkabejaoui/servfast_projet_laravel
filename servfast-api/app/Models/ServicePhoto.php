<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePhoto extends Model
{
    protected $fillable = ['service_id', 'photo_url', 'is_main'];

    protected $casts = ['is_main' => 'boolean'];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
