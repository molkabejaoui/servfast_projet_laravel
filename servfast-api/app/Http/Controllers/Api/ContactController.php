<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Notification;   // ← Ajouter cet import
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // ─── POST /services/{service}/contact ────────────────────────
    public function store(Request $request, Service $service)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:255',
        ]);

        $contact = Contact::create([
            'service_id'  => $service->id,
            'sender_id'   => $request->user()->id,
            'receiver_id' => $service->user_id,
            'message'     => $validated['message'],
            'phone'       => $validated['phone'] ?? null,
            'email'       => $validated['email'] ?? null,
            'status'      => 'pending',
        ]);

        // ── Créer une notification pour le destinataire ────────
        Notification::create([
            'user_id' => $service->user_id,
            'title'   => $request->user()->full_name . ' vous a contacté',
            'message' => $validated['message'],
            'type'    => 'new_contact',
            'is_read' => false,
            'data'    => [
                'contact_id'    => $contact->id,
                'sender_id'     => $request->user()->id,
                'sender_name'   => $request->user()->full_name,
                'service_id'    => $service->id,
                'service_title' => $service->title,
            ],
        ]);

        return response()->json([
            'message' => 'Message envoyé avec succès',
            'contact' => $contact->load([
                'sender:id,full_name,avatar',
                'receiver:id,full_name,avatar',
                'service:id,title',
            ]),
        ], 201);
    }

    // ─── GET /contacts/received ───────────────────────────────────
    public function received(Request $request)
    {
        $contacts = Contact::where('receiver_id', $request->user()->id)
            ->with(['sender:id,full_name,avatar', 'service:id,title'])
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

    // ─── GET /contacts/{contact} ──────────────────────────────────
    public function show(Request $request, Contact $contact)
    {
        if ($contact->sender_id !== $request->user()->id &&
            $contact->receiver_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($contact->load([
            'sender:id,full_name,avatar',
            'receiver:id,full_name,avatar',
            'service:id,title',
        ]));
    }

    // ─── GET /conversations/{userId} ──────────────────────────────
    public function conversation(Request $request, $userId)
    {
        $me = $request->user()->id;

        $messages = Contact::where(function ($q) use ($me, $userId) {
                $q->where('sender_id', $me)->where('receiver_id', $userId);
            })
            ->orWhere(function ($q) use ($me, $userId) {
                $q->where('sender_id', $userId)->where('receiver_id', $me);
            })
            ->with(['sender:id,full_name,avatar', 'receiver:id,full_name,avatar', 'service:id,title'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Marquer comme lus les messages reçus
        Contact::where('sender_id', $userId)
            ->where('receiver_id', $me)
            ->where('status', 'pending')
            ->update(['status' => 'read']);

        return response()->json($messages);
    }

    // ─── POST /conversations/{userId}/reply ───────────────────────
    public function reply(Request $request, $userId)
    {
        $validated = $request->validate([
            'message'    => 'required|string|max:1000',
            'service_id' => 'nullable|exists:services,id',
        ]);

        // Vérifier que le destinataire existe
        $receiver = User::findOrFail($userId);

        $contact = Contact::create([
            'service_id'  => $validated['service_id'] ?? null,
            'sender_id'   => $request->user()->id,
            'receiver_id' => $userId,
            'message'     => $validated['message'],
            'status'      => 'pending',
        ]);

        // ── Charger les relations pour le retour frontend ──────
        $contact->load([
            'sender:id,full_name,avatar',
            'receiver:id,full_name,avatar',
            'service:id,title',
        ]);

        // ── Créer une notification pour le destinataire ────────
        Notification::create([
            'user_id' => $userId,
            'title'   => $request->user()->full_name . ' vous a envoyé un message',
            'message' => $validated['message'],
            'type'    => 'new_contact',
            'is_read' => false,
            'data'    => [
                'contact_id'    => $contact->id,
                'sender_id'     => $request->user()->id,
                'sender_name'   => $request->user()->full_name,
                'service_id'    => $validated['service_id'] ?? null,
                'service_title' => $contact->service?->title ?? null,
            ],
        ]);

        return response()->json([
            'message' => 'Message envoyé',
            'contact' => $contact,
        ], 201);
    }

    // ─── PATCH /contacts/{contact}/read ──────────────────────────
    public function markRead(Request $request, Contact $contact)
    {
        if ($contact->receiver_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $contact->update(['status' => 'read']);
        return response()->json(['message' => 'Marqué comme lu']);
    }
}
