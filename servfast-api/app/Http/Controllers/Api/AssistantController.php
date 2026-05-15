<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;

class AssistantController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:500']);

        $message = strtolower($request->message);
        $categories = Category::all();

        // Chercher une catégorie correspondante
        $matchedCategory = null;
        foreach ($categories as $category) {
            if (str_contains($message, strtolower($category->name)) ||
                str_contains(strtolower($category->name), explode(' ', $message)[0])) {
                $matchedCategory = $category;
                break;
            }
        }

        // Mots clés communs
        $keywords = [
            'plomb'    => 'Plomberie',
            'electr'   => 'Électricité',
            'inform'   => 'Informatique & Technologie',
            'cours'    => 'Cours particuliers',
            'coiff'    => 'Beauté & Bien-être',
            'transport'=> 'Transport & Déménagement',
            'jardin'   => 'Jardinage',
            'nettoy'   => 'Nettoyage',
            'photo'    => 'Photographie & Vidéo',
            'cuisine'  => 'Cuisine & Traiteur',
            'securit'  => 'Sécurité',
            'sport'    => 'Santé & Sport',
            'event'    => 'Événementiel',
            'menuis'   => 'Menuiserie',
        ];

        foreach ($keywords as $keyword => $categoryName) {
            if (str_contains($message, $keyword)) {
                $matchedCategory = Category::where('name', $categoryName)->first();
                break;
            }
        }

        if ($matchedCategory) {
            $count = Service::where('category_id', $matchedCategory->id)
                ->where('status', 'active')->count();

            $reply = "Je vous recommande de consulter la catégorie **{$matchedCategory->name}**. " .
                     "Nous avons actuellement {$count} service(s) disponible(s) dans cette catégorie. " .
                     "Vous pouvez filtrer par ville pour trouver un prestataire près de chez vous !";
        } else {
            $categoryList = $categories->pluck('name')->implode(', ');
            $reply = "Bonjour ! Je suis l'assistant ServFast. Je peux vous aider à trouver un service parmi ces catégories : {$categoryList}. Que recherchez-vous exactement ?";
        }

        return response()->json(['reply' => $reply]);
    }
}