<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // La colonne 'comment' est déjà dans le fillable du modèle Rating
        // Vérifier si elle existe déjà avant d'ajouter
        if (!Schema::hasColumn('ratings', 'comment')) {
            Schema::table('ratings', function (Blueprint $table) {
                $table->text('comment')->nullable()->after('score');
            });
        }

        // Ajouter average_rating et total_ratings sur services si manquants
        if (!Schema::hasColumn('services', 'average_rating')) {
            Schema::table('services', function (Blueprint $table) {
                $table->decimal('average_rating', 3, 2)->default(0)->after('price');
                $table->unsignedInteger('total_ratings')->default(0)->after('average_rating');
            });
        }
    }

    public function down(): void
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->dropColumn('comment');
        });
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['average_rating', 'total_ratings']);
        });
    }
};