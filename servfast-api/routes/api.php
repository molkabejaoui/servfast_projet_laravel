<?php

use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SavedServiceController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ServiceProviderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ═══════════════════════════════════════════════════════════
// ROUTES PUBLIQUES
// ═══════════════════════════════════════════════════════════
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/services',               [ServiceController::class, 'index']);
Route::get('/services/{service}',     [ServiceController::class, 'show']);
Route::get('/categories',             [CategoryController::class, 'index']);
Route::get('/categories/{category}',  [CategoryController::class, 'show']);
Route::get('/services/{service}/ratings', [RatingController::class, 'index']);

// Profil public d'un utilisateur (lecture seule)
Route::get('/users/{user}/profile',   [UserController::class, 'publicProfile']);

Route::post('/webhooks/stripe', [PaymentController::class, 'webhook']);

// ═══════════════════════════════════════════════════════════
// ROUTES PROTÉGÉES
// ═══════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ──────────────────────────────────────────────
    Route::post('/logout',   [AuthController::class, 'logout']);
    Route::get('/me',        [AuthController::class, 'me']);
    Route::post('/me',       [AuthController::class, 'updateProfile']);

    // ── Services ──────────────────────────────────────────
    Route::post('/services',                              [ServiceController::class, 'store']);
    Route::put('/services/{service}',                     [ServiceController::class, 'update']);
    Route::delete('/services/{service}',                  [ServiceController::class, 'destroy']);
    Route::get('/my-services',                            [ServiceController::class, 'myServices']);
    Route::post('/services/{service}/photos',             [ServiceController::class, 'addPhotos']);
    Route::delete('/services/{service}/photos/{photoId}', [ServiceController::class, 'deletePhoto']);

    // ── Catégories ────────────────────────────────────────
    Route::post('/categories', [CategoryController::class, 'store']);

    // ── Ratings ───────────────────────────────────────────
    Route::post('/services/{service}/ratings',  [RatingController::class, 'store']);
    Route::delete('/ratings/{rating}',          [RatingController::class, 'destroy']);

    // ── Contacts / Messagerie ─────────────────────────────
    Route::post('/services/{service}/contact',  [ContactController::class, 'store']);
    Route::get('/contacts/received',            [ContactController::class, 'received']);
    Route::get('/contacts/sent',                [ContactController::class, 'sent']);
    Route::get('/contacts/{contact}',           [ContactController::class, 'show']);
    Route::patch('/contacts/{contact}/read',    [ContactController::class, 'markRead']);
    // Récupérer la conversation entre 2 users pour un service
    Route::get('/conversations/{userId}',       [ContactController::class, 'conversation']);
    // Envoyer un message dans une conversation existante
    Route::post('/conversations/{userId}/reply',[ContactController::class, 'reply']);

    // ── Notifications ─────────────────────────────────────
    Route::get('/notifications',                 [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',    [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read',     [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',       [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}',         [NotificationController::class, 'destroy']);

    // ── Favoris ───────────────────────────────────────────
    Route::get('/saved-services',                [SavedServiceController::class, 'index']);
    Route::post('/services/{service}/save',      [SavedServiceController::class, 'store']);
    Route::delete('/services/{service}/unsave',  [SavedServiceController::class, 'destroy']);
    Route::get('/services/{service}/is-saved',   [SavedServiceController::class, 'isSaved']);

    // ── Signalements ──────────────────────────────────────
    Route::post('/services/{service}/report',           [ReportController::class, 'store']);
    Route::get('/admin/reports',                        [ReportController::class, 'index']);
    Route::patch('/admin/reports/{report}/resolve',     [ReportController::class, 'resolve']);

    // ── Prestataire ───────────────────────────────────────
    Route::get('/provider/profile',                          [ServiceProviderController::class, 'show']);
    Route::post('/provider/profile',                         [ServiceProviderController::class, 'update']);
    Route::post('/admin/providers/{provider}/verify',        [ServiceProviderController::class, 'verify']);

    // ── Paiement ──────────────────────────────────────────
    Route::post('/payments/checkout', [PaymentController::class, 'checkout']);

    // ── Assistant AI ──────────────────────────────────────
    Route::post('/assistant/chat', [AssistantController::class, 'chat']);
});