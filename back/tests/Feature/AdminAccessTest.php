<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_puede_acceder()
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN'
        ]);

        $response = $this->actingAs($admin, 'api')
            ->getJson('/api/admin/cells');

        $response->assertStatus(200);
    }

    public function test_worker_no_puede_acceder()
    {
        $user = User::factory()->create([
            'role' => 'WORKER'
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/admin/cells');

        $response->assertStatus(403);
    }
}