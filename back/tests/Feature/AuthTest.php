<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_correcto()
    {
        $user = User::factory()->create([
            'email' => 'test@test.com',
            'password' => bcrypt('123456'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@test.com',
            'password' => '123456',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'token',
                'user',
            ]);
    }

    public function test_login_incorrecto()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'no@test.com',
            'password' => '123456',
        ]);

        $response->assertStatus(401);
    }
}