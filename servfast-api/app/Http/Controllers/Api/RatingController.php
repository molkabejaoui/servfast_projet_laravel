<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Service;
use App\Services\RatingService;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function __construct(private RatingService $ratingService) {}

    // ─── GET /services/{id}/ratings ──────────────────────────────
    public function index(Service $service)
    {
        $ratings = $service->ratings()
            ->with('reviewer:id,full_name,avatar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'ratings'        => $ratings,
            'average'        => $service->average_rating,
            'total'          => $service->total_ratings,
        ]);
    }

    // ─── POST /services/{id}/ratings ─────────────────────────────
    public function store(Request $request, Service $service)
    {
        // Vérifier qu'on ne note pas son propre service
        if ($service->user_id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas noter votre propre service'], 422);
        }

        // Vérifier qu'on n'a pas déjà noté
        $existing = Rating::where('service_id', $service->id)
            ->where('reviewer_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà noté ce service'], 422);
        }

        $validated = $request->validate([
            'score'   => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $rating = Rating::create([
            'service_id'  => $service->id,
            'reviewer_id' => $request->user()->id,
            'score'       => $validated['score'],
            'comment'     => $validated['comment'] ?? null,
        ]);

        // Recalculer la moyenne et vérifier l'annulation automatique
        $this->ratingService->updateServiceRating($service);

        return response()->json([
            'message' => 'Note ajoutée avec succès',
            'rating'  => $rating->load('reviewer:id,full_name,avatar'),
        ], 201);
    }

    // ─── DELETE /ratings/{id} ────────────────────────────────────
    public function destroy(Request $request, Rating $rating)
    {
        if ($rating->reviewer_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $service = $rating->service;
        $rating->delete();

        $this->ratingService->updateServiceRating($service);

        return response()->json(['message' => 'Note supprimée']);
    }
}
