<?php

namespace Database\Seeders;

use App\Models\Cell;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $cells = Cell::all();
        $workers = User::whereIn('role', ['VET', 'MAINT'])->get();

        if ($cells->isEmpty()) {
            return;
        }

        $tasks = [
            ['type' => 'FEEDING', 'title' => 'Reponer alimento', 'status' => 'PENDING', 'priority' => 1],
            ['type' => 'MEDICAL', 'title' => 'Revision veterinaria', 'status' => 'PENDING', 'priority' => 2],
            ['type' => 'REPAIR', 'title' => 'Reparar valla', 'status' => 'PENDING', 'priority' => 1],
            ['type' => 'CLEANING', 'title' => 'Limpieza de celda', 'status' => 'PENDING', 'priority' => 3],
            ['type' => 'SECURITY', 'title' => 'Comprobar sistemas de seguridad', 'status' => 'PENDING', 'priority' => 2],
        ];

        foreach ($cells as $index => $cell) {
            $baseTask = $tasks[$index % count($tasks)];
            $worker = $workers->isNotEmpty() ? $workers->random() : null;

            Task::create([
                'cell_id' => $cell->id,
                'user_id' => $worker?->id,
                'type' => $baseTask['type'],
                'title' => $baseTask['title'] . ' celda ' . $cell->id,
                'status' => $baseTask['status'],
                'priority' => $baseTask['priority'],
                'started_at' => null,
                'finished_at' => null,
            ]);
        }
    }
}