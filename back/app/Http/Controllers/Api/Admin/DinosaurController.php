<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dinosaur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DinosaurController extends Controller
{
    public function index(): JsonResponse
    {
        $dinosaurs = Dinosaur::with('cell')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Dinosaurios obtenidos correctamente',
            'data' => $dinosaurs,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nick' => 'required|string|max:255|unique:dinosaurs,nick',
            'species' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:65535',
            'diet' => 'required|in:HERBIVORE,CARNIVORE,OMNIVORE',
            'danger_level' => 'required|in:LOW,MEDIUM,HIGH',
            'cell_id' => 'nullable|exists:cells,id',
        ]);

        $dinosaur = Dinosaur::create($data);
        $dinosaur->load('cell');

        return response()->json([
            'success' => true,
            'message' => 'Dinosaurio creado correctamente',
            'data' => $dinosaur,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $dinosaur = Dinosaur::with('cell')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Dinosaurio obtenido correctamente',
            'data' => $dinosaur,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $dinosaur = Dinosaur::findOrFail($id);

        $data = $request->validate([
            'nick' => 'sometimes|string|max:255|unique:dinosaurs,nick,' . $dinosaur->id,
            'species' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer|min:1|max:65535',
            'diet' => 'sometimes|in:HERBIVORE,CARNIVORE,OMNIVORE',
            'danger_level' => 'sometimes|in:LOW,MEDIUM,HIGH',
            'cell_id' => 'nullable|exists:cells,id',
        ]);

        $dinosaur->update($data);
        $dinosaur->load('cell');

        return response()->json([
            'success' => true,
            'message' => 'Dinosaurio actualizado correctamente',
            'data' => $dinosaur,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $dinosaur = Dinosaur::findOrFail($id);
        $dinosaur->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dinosaurio eliminado correctamente',
        ]);
    }
}