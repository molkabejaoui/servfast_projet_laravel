<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'service_id',
        'reviewer_id',   // user qui donne la note
        'score',         // 1 à 5
        'comment',
    ];

    protected $casts = [
        'score' => 'integer',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
