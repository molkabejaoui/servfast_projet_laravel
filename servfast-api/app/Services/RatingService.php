<?php

namespace App\Services;

use App\Models\Service;

class RatingService
{
    // Seuil en dessous duquel le service est annulé automatiquement
    const BAD_RATING_THRESHOLD = 2.0;

    // Nombre minimum d'avis avant de déclencher l'annulation
    const MIN_RATINGS_REQUIRED = 5;

    /**
     * Recalculer la moyenne du service et annuler si nécessaire.
     */
    public function updateServiceRating(Service $service): void
    {
        $ratings = $service->ratings();
        $count   = $ratings->count();
        $avg     = $count > 0 ? round($ratings->avg('score'), 2) : 0;

        $service->update([
            'average_rating' => $avg,
            'total_ratings'  => $count,
        ]);

        // ── Logique d'annulation automatique ─────────────────────
        if ($count >= self::MIN_RATINGS_REQUIRED && $avg < self::BAD_RATING_THRESHOLD) {
            $this->cancelService($service);
        }
    }

    /**
     * Annuler le service et notifier son propriétaire.
     */
    private function cancelService(Service $service): void
    {
        if ($service->status === 'cancelled') {
            return; // Déjà annulé
        }

        $service->update(['status' => 'cancelled']);

        $service->user->notifications()->create([
            'title'   => '⚠️ Service annulé automatiquement',
            'message' => "Votre service \"{$service->title}\" a été annulé automatiquement car sa note moyenne ({$service->average_rating}/5) est inférieure au seuil minimum requis de " . self::BAD_RATING_THRESHOLD . "/5 après " . $service->total_ratings . " avis.",
            'type'    => 'service_cancelled',
            'data'    => [
                'service_id'     => $service->id,
                'average_rating' => $service->average_rating,
                'total_ratings'  => $service->total_ratings,
            ],
        ]);
    }
}
