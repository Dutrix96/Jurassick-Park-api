<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dinosaurs', function (Blueprint $table) {
            $table->id();

            $table->string('nick');
            $table->string('species');
            $table->unsignedSmallInteger('age')->default(1);

            $table->string('diet');
            $table->string('danger_level');

            $table->foreignId('cell_id')->nullable()->constrained('cells')->nullOnDelete();

            $table->timestamps();

            $table->unique('nick');
            $table->index(['species', 'diet', 'danger_level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dinosaurs');
    }
};