<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('city')->nullable();
            $table->enum('status', ['active', 'inactive', 'cancelled'])->default('active');
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_ratings')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('services'); }
};
