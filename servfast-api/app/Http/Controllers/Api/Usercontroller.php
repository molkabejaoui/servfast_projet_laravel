<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    // ─── GET /users/{user}/profile ────────────────────────────────
    // Profil public d'un utilisateur (sans données sensibles)
    public function publicProfile(User $user)
    {
        return response()->json([
            'id'         => $user->id,
            'full_name'  => $user->full_name,
            'avatar'     => $user->avatar,
            'avatar_url' => $user->avatar_url,
            'city'       => $user->city,
            'bio'        => $user->bio,
            'role'       => $user->role,
            'services'   => $user->services()
                ->with(['photos', 'category'])
                ->withAvg('ratings', 'score')
                ->get(),
        ]);
    }
}