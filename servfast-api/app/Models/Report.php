<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'service_id',
        'reporter_id',
        'reason',
        'description',
        'status',        // 'pending', 'reviewed', 'resolved'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
