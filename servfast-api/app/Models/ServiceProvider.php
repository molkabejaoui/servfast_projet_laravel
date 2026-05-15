<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceProvider extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'experience_years',
        'skills',
        'portfolio_url',
        'is_verified',
        'id_document',
    ];

    protected $casts = [
        'skills'      => 'array',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
