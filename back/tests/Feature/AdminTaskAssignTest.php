<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminTaskAssignTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_puede_asignar_tarea_a_trabajador()
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
        ]);

        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $cell = Cell::factory()->create();

        $task = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => null,
        ]);

        $response = $this->actingAs($admin, 'api')
            ->patchJson("/api/admin/tasks/{$task->id}/assign", [
                'user_id' => $worker->id,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'user_id' => $worker->id,
        ]);
    }

    public function test_worker_no_puede_asignar_tareas()
    {
        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $otherWorker = User::factory()->create([
            'role' => 'MANTENIMIENTO',
        ]);

        $cell = Cell::factory()->create();

        $task = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => null,
        ]);

        $response = $this->actingAs($worker, 'api')
            ->patchJson("/api/admin/tasks/{$task->id}/assign", [
                'user_id' => $otherWorker->id,
            ]);

        $response->assertStatus(403);
    }
}