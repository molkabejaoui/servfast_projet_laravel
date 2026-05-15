<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ── service_photos ────────────────────────────────────────
        Schema::create('service_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->string('photo_url');
            $table->boolean('is_main')->default(false);
            $table->timestamps();
        });

        // ── service_providers ─────────────────────────────────────
        Schema::create('service_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('bio')->nullable();
            $table->unsignedTinyInteger('experience_years')->default(0);
            $table->json('skills')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('id_document')->nullable();
            $table->timestamps();
        });

        // ── ratings ───────────────────────────────────────────────
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewer_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('score');   // 1 à 5
            $table->text('comment')->nullable();
            $table->unique(['service_id', 'reviewer_id']); // 1 avis par user/service
            $table->timestamps();
        });

        // ── contacts ──────────────────────────────────────────────
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['pending', 'read', 'replied'])->default('pending');
            $table->timestamps();
        });

        // ── notifications ─────────────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type');
            $table->boolean('is_read')->default(false);
            $table->json('data')->nullable();
            $table->timestamps();
        });

        // ── reports ───────────────────────────────────────────────
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->enum('reason', ['spam', 'fake', 'inappropriate', 'fraud', 'other']);
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'resolved'])->default('pending');
            $table->timestamps();
        });

        // ── saved_services ────────────────────────────────────────
        Schema::create('saved_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'service_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_services');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('service_providers');
        Schema::dropIfExists('service_photos');
    }
};
