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
use Illuminate\Support\Facades\Route;

// ═══════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (sans authentification)
// ═══════════════════════════════════════════════════════════
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Services & Catégories (lecture publique)
Route::get('/services',          [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/categories',        [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Ratings lecture publique
Route::get('/services/{service}/ratings', [RatingController::class, 'index']);

// Webhook Stripe (doit être avant le middleware auth)
Route::post('/webhooks/stripe', [PaymentController::class, 'webhook']);

// ═══════════════════════════════════════════════════════════
// ROUTES PROTÉGÉES (auth:sanctum requis)
// ═══════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ─────────────────────────────────────────────────────
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::get('/me',              [AuthController::class, 'me']);
    Route::post('/me',             [AuthController::class, 'updateProfile']);

    // ── Services ──────────────────────────────────────────────────
    Route::post('/services',                              [ServiceController::class, 'store']);
    Route::put('/services/{service}',                     [ServiceController::class, 'update']);
    Route::delete('/services/{service}',                  [ServiceController::class, 'destroy']);
    Route::get('/my-services',                            [ServiceController::class, 'myServices']);
    Route::post('/services/{service}/photos',             [ServiceController::class, 'addPhotos']);
    Route::delete('/services/{service}/photos/{photoId}', [ServiceController::class, 'deletePhoto']);

    // ── Catégories (admin) ────────────────────────────────────────
    Route::post('/categories', [CategoryController::class, 'store']);

    // ── Ratings ───────────────────────────────────────────────────
    Route::post('/services/{service}/ratings',   [RatingController::class, 'store']);
    Route::delete('/ratings/{rating}',           [RatingController::class, 'destroy']);

    // ── Contacts ──────────────────────────────────────────────────
    Route::post('/services/{service}/contact',   [ContactController::class, 'store']);
    Route::get('/contacts/received',             [ContactController::class, 'received']);
    Route::get('/contacts/sent',                 [ContactController::class, 'sent']);
    Route::patch('/contacts/{contact}/read',     [ContactController::class, 'markRead']);

    // ── Notifications ─────────────────────────────────────────────
    Route::get('/notifications',                 [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',    [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read',     [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',       [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}',         [NotificationController::class, 'destroy']);

    // ── Favoris ───────────────────────────────────────────────────
    Route::get('/saved-services',                [SavedServiceController::class, 'index']);
    Route::post('/services/{service}/save',      [SavedServiceController::class, 'store']);
    Route::delete('/services/{service}/unsave',  [SavedServiceController::class, 'destroy']);

    // ── Signalements ──────────────────────────────────────────────
    Route::post('/services/{service}/report',    [ReportController::class, 'store']);
    Route::get('/admin/reports',                 [ReportController::class, 'index']);
    Route::patch('/admin/reports/{report}/resolve', [ReportController::class, 'resolve']);

    // ── Prestataire ───────────────────────────────────────────────
    Route::get('/provider/profile',              [ServiceProviderController::class, 'show']);
    Route::post('/provider/profile',             [ServiceProviderController::class, 'update']);
    Route::post('/admin/providers/{provider}/verify', [ServiceProviderController::class, 'verify']);

    // ── Paiement ──────────────────────────────────────────────────
    Route::post('/payments/checkout',            [PaymentController::class, 'checkout']);

    // ── Assistant AI ──────────────────────────────────────────────
    Route::post('/assistant/chat',               [AssistantController::class, 'chat']);
});
