<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6|confirmed',
            'phone'     => 'nullable|string|max:20',
            'city'      => 'nullable|string|max:100',
            'role'      => 'nullable|in:client,provider',
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'phone'     => $validated['phone'] ?? null,
            'city'      => $validated['city'] ?? null,
            'role'      => $validated['role'] ?? 'client',
        ]);

        // Si prestataire, créer son profil provider
        if ($user->role === 'provider') {
            $user->serviceProvider()->create([
                'bio'              => null,
                'experience_years' => 0,
                'is_verified'      => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès',
            'user'    => $user->load('serviceProvider'),
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Compte désactivé'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user'    => $user->load('serviceProvider'),
            'token'   => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('serviceProvider'));
    }

    public function updateProfile(Request $request)
{
    $validated = $request->validate([
        'full_name' => 'sometimes|string|max:255',
        'phone'     => 'sometimes|nullable|string|max:20',
        'city'      => 'sometimes|nullable|string|max:100',
        'bio'       => 'sometimes|nullable|string|max:1000',
        'avatar'    => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
    ]);

    $user = $request->user();
    $data = collect($validated)->except('avatar')->toArray();

    if ($request->hasFile('avatar')) {
        // Supprimer l'ancien avatar s'il existe (et n'est pas une URL externe)
        if ($user->avatar && !filter_var($user->avatar, FILTER_VALIDATE_URL)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
        }
        $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
    }

    $user->update($data);

    return response()->json([
        'message' => 'Profil mis à jour avec succès',
        'user'    => $user->fresh(),
    ]);
}
}
