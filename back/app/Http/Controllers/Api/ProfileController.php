<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $user = Auth::guard('api')->user();

        return response()->json([
            'success' => true,
            'message' => 'Perfil obtenido correctamente',
            'data' => $user,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = Auth::guard('api')->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'data' => $user,
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $user = Auth::guard('api')->user();

        $data = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'La contrasena actual no es correcta',
            ], 422);
        }

        $user->update([
            'password' => $data['password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contrasena actualizada correctamente',
        ]);
    }

    public function updateAvatar(Request $request): JsonResponse
    {
        $user = Auth::guard('api')->user();

        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($user->avatar_url) {
            $oldPath = str_replace('/storage/', '', parse_url($user->avatar_url, PHP_URL_PATH) ?? '');

            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update([
            'avatar_url' => '/storage/' . $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar actualizado correctamente',
            'data' => $user,
        ]);
    }
}