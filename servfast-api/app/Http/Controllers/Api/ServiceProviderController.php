<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;

class ServiceProviderController extends Controller
{
    public function show(Request $request)
    {
        $provider = $request->user()->serviceProvider;

        if (!$provider) {
            return response()->json(['message' => 'Profil prestataire non trouvé'], 404);
        }

        return response()->json($provider);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bio'              => 'nullable|string|max:1000',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'skills'           => 'nullable|array',
            'skills.*'         => 'string|max:50',
            'portfolio_url'    => 'nullable|url',
            'id_document'      => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:4096',
        ]);

        if ($request->hasFile('id_document')) {
            $path = $request->file('id_document')->store('documents', 'private');
            $validated['id_document'] = $path;
        }

        $provider = $request->user()->serviceProvider;

        if (!$provider) {
            $provider = $request->user()->serviceProvider()->create($validated);
        } else {
            $provider->update($validated);
        }

        return response()->json(['message' => 'Profil mis à jour', 'provider' => $provider]);
    }

    // Admin: vérifier un prestataire
    public function verify(Request $request, ServiceProvider $provider)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $provider->update(['is_verified' => true]);

        $provider->user->notifications()->create([
            'title'   => 'Compte vérifié',
            'message' => 'Votre compte prestataire a été vérifié avec succès !',
            'type'    => 'account_verified',
        ]);

        return response()->json(['message' => 'Prestataire vérifié']);
    }
}
