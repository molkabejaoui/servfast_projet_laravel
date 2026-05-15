<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Webhook;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // ─── POST /payments/checkout ─────────────────────────────────
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        if (!$service->price) {
            return response()->json(['message' => 'Ce service n\'a pas de prix défini'], 422);
        }

        $paymentIntent = PaymentIntent::create([
            'amount'   => (int) ($service->price * 100), // centimes
            'currency' => 'eur',
            'metadata' => [
                'service_id' => $service->id,
                'buyer_id'   => $request->user()->id,
            ],
        ]);

        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
            'amount'        => $service->price,
        ]);
    }

    // ─── POST /webhooks/stripe (sans auth) ───────────────────────
    public function webhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent    = $event->data->object;
            $serviceId = $intent->metadata->service_id;
            $buyerId   = $intent->metadata->buyer_id;

            // Notifier le prestataire
            $service = Service::find($serviceId);
            if ($service) {
                $service->user->notifications()->create([
                    'title'   => 'Paiement reçu',
                    'message' => "Paiement reçu pour votre service '{$service->title}'",
                    'type'    => 'payment',
                    'data'    => ['service_id' => $serviceId, 'buyer_id' => $buyerId],
                ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
