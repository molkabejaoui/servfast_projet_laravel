<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'service_id',
        'sender_id',
        'receiver_id',
        'message',
        'status',        // 'pending', 'read', 'replied'
        'phone',
        'email',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
