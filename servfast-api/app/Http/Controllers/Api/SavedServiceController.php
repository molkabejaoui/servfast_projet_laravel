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
        $saved = $request->user()->savedServices()
            ->with(['service.category', 'service.photos'])
            ->get()
            ->pluck('service');

        return response()->json($saved);
    }

    public function store(Request $request, Service $service)
    {
        $exists = SavedService::where('user_id', $request->user()->id)
            ->where('service_id', $service->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Déjà dans vos favoris'], 422);
        }

        SavedService::create([
            'user_id'    => $request->user()->id,
            'service_id' => $service->id,
        ]);

        return response()->json(['message' => 'Service sauvegardé'], 201);
    }

    public function destroy(Request $request, Service $service)
    {
        SavedService::where('user_id', $request->user()->id)
            ->where('service_id', $service->id)
            ->delete();

        return response()->json(['message' => 'Retiré des favoris']);
    }
}
