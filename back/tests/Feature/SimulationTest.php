<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SimulationTest extends TestCase
{
    use RefreshDatabase;

    public function test_simulacion_normal()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/simulations/normal', []);

        $response->assertStatus(200);
    }

    public function test_simulacion_brecha()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/simulations/breach', [
                'random' => true
            ]);

        $response->assertStatus(200);
    }
}