<?php

namespace Database\Factories;

use App\Models\Cell;
use App\Models\Dinosaur;
use Illuminate\Database\Eloquent\Factories\Factory;

class DinosaurFactory extends Factory
{
    protected $model = Dinosaur::class;

    public function definition(): array
    {
        return [
            'nick' => fake()->unique()->firstName(),
            'species' => fake()->randomElement(['Velociraptor', 'Triceratops', 'Tyrannosaurus rex']),
            'age' => fake()->numberBetween(1, 20),
            'diet' => fake()->randomElement(['HERBIVORE', 'CARNIVORE', 'OMNIVORE']),
            'danger_level' => fake()->randomElement(['LOW', 'MEDIUM', 'HIGH']),
            'cell_id' => Cell::factory(),
        ];
    }
}