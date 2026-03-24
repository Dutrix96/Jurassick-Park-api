<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Cell;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'cell_id' => Cell::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['FEEDING', 'MAINTENANCE', 'SECURITY']),
            'title' => fake()->sentence(3),
            'status' => TaskStatus::PENDING->value,
            'priority' => fake()->numberBetween(1, 3),
            'started_at' => null,
            'finished_at' => null,
        ];
    }
}