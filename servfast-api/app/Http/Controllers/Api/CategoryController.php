<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount(['services' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        return response()->json($categories);
    }

    public function show(Category $category)
    {
        $category->load(['services' => function ($q) {
            $q->active()->with('photos')->limit(10);
        }]);
        return response()->json($category);
    }

    // Admin only
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:categories',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
            'slug'        => 'nullable|string|unique:categories',
        ]);

        $validated['slug'] = $validated['slug'] ?? \Str::slug($validated['name']);
        $category = Category::create($validated);

        return response()->json($category, 201);
    }
}
