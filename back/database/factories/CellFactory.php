<?php

namespace Database\Factories;

use App\Models\Cell;
use Illuminate\Database\Eloquent\Factories\Factory;

class CellFactory extends Factory
{
    protected $model = Cell::class;

    public function definition(): array
    {
        return [
            'row' => fake()->numberBetween(1, 10),
            'col' => fake()->numberBetween(1, 10),
            'security_level' => fake()->numberBetween(30, 100),
            'food_level' => fake()->numberBetween(30, 100),
            'pending_repairs' => fake()->numberBetween(0, 5),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}