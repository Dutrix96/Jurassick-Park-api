<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_worker_cambia_estado()
    {
        $worker = User::factory()->create(['role' => 'WORKER']);
        $cell = Cell::factory()->create();

        $task = Task::create([
            'cell_id' => $cell->id,
            'user_id' => $worker->id,
            'type' => 'maintenance',
            'title' => 'Arreglar valla',
            'status' => 'PENDING'
        ]);

        $response = $this->actingAs($worker, 'api')
            ->patchJson("/api/tasks/{$task->id}/status", [
                'status' => 'in_progress'
            ]);

        $response->assertStatus(200);
    }
}