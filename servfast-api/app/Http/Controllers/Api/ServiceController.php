<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\RatingService;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(private RatingService $ratingService) {}

    // ─── GET /services (public, avec filtres) ─────────────────────
    public function index(Request $request)
    {
        $services = Service::with(['category', 'photos', 'user'])
            ->active()
            ->byCategory($request->category_id)
            ->byCity($request->city)
            ->search($request->search)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($services);
    }

    // ─── GET /services/{id} (public) ─────────────────────────────
    public function show(Service $service)
    {
        $service->load(['category', 'photos', 'user.serviceProvider', 'ratings.reviewer']);
        return response()->json($service);
    }

    // ─── POST /services (auth requis) ────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'category_id' => 'required|exists:categories,id',
            'price'       => 'nullable|numeric|min:0',
            'city'        => 'nullable|string|max:100',
            'photos'      => 'nullable|array|max:5',
            'photos.*'    => 'image|max:3072',
        ]);

        $service = $request->user()->services()->create($validated);

        // Sauvegarder les photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('services', 'public');
                $service->photos()->create([
                    'photo_url' => $path,
                    'is_main'   => $index === 0,
                ]);
            }
        }

        return response()->json([
            'message' => 'Service créé avec succès',
            'service' => $service->load('photos', 'category'),
        ], 201);
    }

    // ─── PUT /services/{id} (propriétaire seulement) ─────────────
    public function update(Request $request, Service $service)
    {
        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:20',
            'category_id' => 'sometimes|exists:categories,id',
            'price'       => 'sometimes|nullable|numeric|min:0',
            'city'        => 'sometimes|nullable|string|max:100',
            'status'      => 'sometimes|in:active,inactive',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service mis à jour',
            'service' => $service->fresh()->load('photos', 'category'),
        ]);
    }

    // ─── DELETE /services/{id} ───────────────────────────────────
    public function destroy(Request $request, Service $service)
    {
        if ($service->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Récupérer la catégorie avant suppression
        $category = $service->category;
        $categoryId = $category?->id;

        // Supprimer les photos du service
        foreach ($service->photos as $photo) {
            \Storage::disk('public')->delete($photo->photo_url);
        }

        // Supprimer le service
        $service->delete();

        // Vérifier et supprimer la catégorie si elle n'a plus de services
        if ($categoryId && $category) {
            $remainingServices = Service::where('category_id', $categoryId)->count();
            if ($remainingServices === 0) {
                $category->delete();
            }
        }

        return response()->json(['message' => 'Service supprimé']);
    }

    // ─── GET /my-services (mes propres services) ─────────────────
    public function myServices(Request $request)
    {
        $services = $request->user()->services()
            ->with(['category', 'photos'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($services);
    }

    // ─── POST /services/{id}/photos ──────────────────────────────
    public function addPhotos(Request $request, Service $service)
    {
        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate(['photos' => 'required|array', 'photos.*' => 'image|max:3072']);

        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('services', 'public');
            $service->photos()->create(['photo_url' => $path, 'is_main' => false]);
        }

        return response()->json(['message' => 'Photos ajoutées', 'photos' => $service->photos]);
    }

    // ─── DELETE /services/{id}/photos/{photoId} ──────────────────
    public function deletePhoto(Request $request, Service $service, $photoId)
    {
        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $photo = $service->photos()->findOrFail($photoId);
        \Storage::disk('public')->delete($photo->photo_url);
        $photo->delete();

        return response()->json(['message' => 'Photo supprimée']);
    }
}
