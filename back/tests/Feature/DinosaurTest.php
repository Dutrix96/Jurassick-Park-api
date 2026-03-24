<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DinosaurTest extends TestCase
{
    use RefreshDatabase;

    public function test_crear_dinosaurio()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        $cell = Cell::factory()->create();

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/dinosaurs', [
                'nick' => 'Rexy',
                'species' => 'T-Rex',
                'age' => 5,
                'diet' => 'carnivore',
                'danger_level' => 'extreme',
                'cell_id' => $cell->id
            ]);

        $response->assertStatus(201);
    }
}