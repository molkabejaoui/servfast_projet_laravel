<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedService;
use App\Models\Service;
use Illuminate\Http\Request;

class SavedServiceController extends Controller
{
    public function index(Request $request)
    {
        $saved = SavedService::where('user_id', $request->user()->id)
            ->with(['service.photos', 'service.category', 'service.user'])
            ->get()
            ->pluck('service')
            ->filter();

        return response()->json(['data' => $saved]);
    }

    public function store(Request $request, Service $service)
    {
        $existing = SavedService::where('user_id', $request->user()->id)
            ->where('service_id', $service->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Déjà enregistré', 'saved' => true]);
        }

        SavedService::create([
            'user_id'    => $request->user()->id,
            'service_id' => $service->id,
        ]);

        return response()->json(['message' => 'Service enregistré', 'saved' => true], 201);
    }

    public function destroy(Request $request, Service $service)
    {
        SavedService::where('user_id', $request->user()->id)
            ->where('service_id', $service->id)
            ->delete();

        return response()->json(['message' => 'Service retiré des favoris', 'saved' => false]);
    }

    // ─── GET /services/{service}/is-saved ────────────────────────
    public function isSaved(Request $request, Service $service)
    {
        $saved = SavedService::where('user_id', $request->user()->id)
            ->where('service_id', $service->id)
            ->exists();

        return response()->json(['saved' => $saved]);
    }
}