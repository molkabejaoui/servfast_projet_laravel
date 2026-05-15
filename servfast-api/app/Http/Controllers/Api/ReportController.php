<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Service;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request, Service $service)
    {
        // Vérifier doublon
        $exists = Report::where('service_id', $service->id)
            ->where('reporter_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Vous avez déjà signalé ce service'], 422);
        }

        $validated = $request->validate([
            'reason'      => 'required|in:spam,fake,inappropriate,fraud,other',
            'description' => 'nullable|string|max:500',
        ]);

        $report = Report::create([
            'service_id'  => $service->id,
            'reporter_id' => $request->user()->id,
            'reason'      => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'status'      => 'pending',
        ]);

        return response()->json(['message' => 'Signalement envoyé', 'report' => $report], 201);
    }

    // Admin only
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reports = Report::with(['service:id,title', 'reporter:id,full_name,email'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reports);
    }

    // Admin – résoudre un signalement
    public function resolve(Request $request, Report $report)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $report->update(['status' => 'resolved']);
        return response()->json(['message' => 'Signalement résolu']);
    }
}
