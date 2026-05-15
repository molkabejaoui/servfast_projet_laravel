<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'city',
        'status',          // 'active', 'inactive', 'cancelled'
        'average_rating',
        'total_ratings',
    ];

    protected $casts = [
        'price'          => 'decimal:2',
        'average_rating' => 'decimal:2',
        'total_ratings'  => 'integer',
    ];

    protected $appends = [
        'image_url',
        'category_name',
        'provider_name',
    ];

    public function getImageUrlAttribute(): ?string
    {
        $photo = $this->photos->first();
        if (!$photo) {
            $photo = $this->photos()->first();
        }

        if (!$photo) {
            return null;
        }

        $path = $photo->photo_url;
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    public function getCategoryNameAttribute(): ?string
    {
        return $this->category?->name;
    }

    public function getProviderNameAttribute(): ?string
    {
        return $this->user?->full_name;
    }

    // ─── Relations ───────────────────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function photos()
    {
        return $this->hasMany(ServicePhoto::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function provider()
    {
        return $this->hasOneThrough(ServiceProvider::class, User::class, 'id', 'user_id', 'user_id', 'id');
    }

    public function savedBy()
    {
        return $this->hasMany(SavedService::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $categoryId ? $query->where('category_id', $categoryId) : $query;
    }

    public function scopeByCity($query, $city)
    {
        return $city ? $query->where('city', 'like', "%{$city}%") : $query;
    }

    public function scopeSearch($query, $search)
    {
        return $search ? $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        }) : $query;
    }
}
