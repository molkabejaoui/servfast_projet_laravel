<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Service;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // ─── POST /services/{id}/contact ─────────────────────────────
    public function store(Request $request, Service $service)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:10|max:1000',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email',
        ]);

        $contact = Contact::create([
            'service_id'  => $service->id,
            'sender_id'   => $request->user()->id,
            'receiver_id' => $service->user_id,
            'message'     => $validated['message'],
            'phone'       => $validated['phone'] ?? $request->user()->phone,
            'email'       => $validated['email'] ?? $request->user()->email,
            'status'      => 'pending',
        ]);

        // Notifier le prestataire
        $service->user->notifications()->create([
            'title'   => 'Nouveau message',
            'message' => "Vous avez reçu un nouveau message pour votre service '{$service->title}'",
            'type'    => 'new_contact',
            'data'    => ['contact_id' => $contact->id, 'service_id' => $service->id],
        ]);

        return response()->json(['message' => 'Message envoyé avec succès', 'contact' => $contact], 201);
    }

    // ─── GET /contacts/received ───────────────────────────────────
    public function received(Request $request)
    {
        $contacts = Contact::where('receiver_id', $request->user()->id)
            ->with(['sender:id,full_name,avatar,phone,email', 'service:id,title'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($contacts);
    }

    // ─── GET /contacts/sent ───────────────────────────────────────
    public function sent(Request $request)
    {
        $contacts = Contact::where('sender_id', $request->user()->id)
            ->with(['receiver:id,full_name,avatar', 'service:id,title'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($contacts);
    }

    // ─── PATCH /contacts/{id}/read ────────────────────────────────
    public function markRead(Request $request, Contact $contact)
    {
        if ($contact->receiver_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        $contact->update(['status' => 'read']);
        return response()->json(['message' => 'Message marqué comme lu']);
    }
}
