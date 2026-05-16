<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'phone',
        'city',
        'role',           // 'client', 'provider', 'admin'
        'avatar',
        'bio',
        'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    protected $appends = [
        'first_name',
        'last_name',
        'avatar_url',
        
    ];

    public function getFirstNameAttribute(): string
    {
        $fullName = trim($this->attributes['full_name'] ?? '');
        return explode(' ', $fullName)[0] ?? '';
    }

    public function getLastNameAttribute(): string
    {
        $fullName = trim($this->attributes['full_name'] ?? '');
        $parts = explode(' ', $fullName);
        array_shift($parts);
        return implode(' ', $parts);
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (empty($this->attributes['avatar'])) {
            return null;
        }

        $avatar = $this->attributes['avatar'];
        if (filter_var($avatar, FILTER_VALIDATE_URL)) {
            return $avatar;
        }

        return asset('storage/' . ltrim($avatar, '/'));
    }

    // ─── Relations ───────────────────────────────────────────────
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function serviceProvider()
    {
        return $this->hasOne(ServiceProvider::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'reviewer_id');
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'sender_id');
    }

    public function receivedContacts()
    {
        return $this->hasMany(Contact::class, 'receiver_id');
    }

    public function savedServices()
    {
        return $this->hasMany(SavedService::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    // ─── Helpers ─────────────────────────────────────────────────
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isProvider(): bool
    {
        return $this->role === 'provider';
    }
}
