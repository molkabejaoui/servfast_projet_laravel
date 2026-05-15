<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ─────────────────────────────────────────────────
        User::create([
            'full_name' => 'Admin ServFast',
            'email'     => 'admin@servfast.com',
            'password'  => Hash::make('admin123'),
            'role'      => 'admin',
            'is_active' => true,
        ]);

        // ── Catégories ────────────────────────────────────────────
        $categories = [
            ['name' => 'Informatique & Technologie', 'icon' => 'laptop',      'description' => 'Développement web, mobile, support IT',                    'type' => 'Solutions'],
            ['name' => 'Plomberie',                  'icon' => 'droplet',     'description' => 'Réparation et installation plomberie',                   'type' => 'Enterprise'],
            ['name' => 'Électricité',                'icon' => 'zap',         'description' => 'Installation et réparation électrique',                  'type' => 'Enterprise'],
            ['name' => 'Menuiserie',                 'icon' => 'tool',        'description' => 'Travaux en bois et mobilier',                           'type' => 'Enterprise'],
            ['name' => 'Cours particuliers',         'icon' => 'book-open',   'description' => 'Soutien scolaire, formation, langues',                  'type' => 'Solutions'],
            ['name' => 'Beauté & Bien-être',         'icon' => 'scissors',    'description' => 'Coiffure, esthétique, massage',                         'type' => 'Enterprise'],
            ['name' => 'Transport & Déménagement',   'icon' => 'truck',       'description' => 'Transport de marchandises, déménagement',               'type' => 'Enterprise'],
            ['name' => 'Jardinage',                  'icon' => 'feather',     'description' => 'Entretien jardin, espace vert',                        'type' => 'Enterprise'],
            ['name' => 'Nettoyage',                  'icon' => 'wind',        'description' => 'Ménage, nettoyage professionnel',                       'type' => 'Enterprise'],
            ['name' => 'Photographie & Vidéo',       'icon' => 'camera',      'description' => 'Photo événementielle, vidéo',                          'type' => 'Solutions'],
            ['name' => 'Cuisine & Traiteur',         'icon' => 'coffee',      'description' => 'Cuisine à domicile, traiteur',                         'type' => 'Enterprise'],
            ['name' => 'Sécurité',                   'icon' => 'shield',      'description' => 'Gardiennage, système sécurité',                        'type' => 'Solutions'],
            ['name' => 'Santé & Sport',              'icon' => 'activity',    'description' => 'Coach sportif, soins à domicile',                      'type' => 'Solutions'],
            ['name' => 'Événementiel',               'icon' => 'star',        'description' => 'Organisation événements, animation',                   'type' => 'Solutions'],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name'        => $cat['name'],
                'slug'        => Str::slug($cat['name']),
                'icon'        => $cat['icon'],
                'description' => $cat['description'],
                'type'        => $cat['type'],
            ]);
        }
    }
}
