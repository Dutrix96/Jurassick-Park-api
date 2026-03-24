<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_puede_ver_su_perfil()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_usuario_puede_actualizar_su_perfil()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->putJson('/api/profile', [
                'name' => 'Nuevo Nombre',
                'email' => 'nuevo@email.com',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nuevo Nombre',
            'email' => 'nuevo@email.com',
        ]);
    }

    public function test_usuario_puede_cambiar_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('123456'),
        ]);

        $response = $this->actingAs($user, 'api')
            ->putJson('/api/profile/password', [
                'current_password' => '123456',
                'password' => '12345678',
                'password_confirmation' => '12345678',
            ]);

        $response->assertStatus(200);
    }

    public function test_usuario_puede_subir_avatar()
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->postJson('/api/profile/avatar', [
                'avatar' => UploadedFile::fake()->image('avatar.jpg'),
            ]);

        $response->assertStatus(200);
    }
}