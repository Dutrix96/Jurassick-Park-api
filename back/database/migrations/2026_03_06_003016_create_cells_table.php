<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cells', function (Blueprint $table) {
            $table->id();

            $table->unsignedSmallInteger('row');
            $table->unsignedSmallInteger('col');

            $table->unsignedTinyInteger('security_level')->default(80);
            $table->unsignedTinyInteger('food_level')->default(100);
            $table->unsignedInteger('pending_repairs')->default(0);

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->unique(['row', 'col']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cells');
    }
};