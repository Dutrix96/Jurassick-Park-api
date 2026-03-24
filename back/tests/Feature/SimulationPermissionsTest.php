<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SimulationPermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_worker_no_puede_lanzar_simulacion_normal()
    {
        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $response = $this->actingAs($worker, 'api')
            ->postJson('/api/admin/simulations/normal', []);

        $response->assertStatus(403);
    }

    public function test_worker_no_puede_lanzar_simulacion_brecha()
    {
        $worker = User::factory()->create([
            'role' => 'MANTENIMIENTO',
        ]);

        $response = $this->actingAs($worker, 'api')
            ->postJson('/api/admin/simulations/breach', [
                'random' => true,
            ]);

        $response->assertStatus(403);
    }
}