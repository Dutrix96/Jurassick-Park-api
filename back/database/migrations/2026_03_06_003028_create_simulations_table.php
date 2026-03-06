<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('simulations', function (Blueprint $table) {
            $table->id();

            $table->string('type');
            $table->string('result')->default('OK');

            $table->foreignId('triggered_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('affected_cell_id')->nullable()->constrained('cells')->nullOnDelete();

            $table->json('report')->nullable();

            $table->timestamps();

            $table->index(['type', 'result']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulations');
    }
};