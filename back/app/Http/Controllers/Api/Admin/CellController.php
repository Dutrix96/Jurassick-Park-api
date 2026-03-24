<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cell;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CellController extends Controller
{
    public function index(): JsonResponse
    {
        $cells = Cell::with('dinosaurs')
            ->orderBy('row')
            ->orderBy('col')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Celdas obtenidas correctamente',
            'data' => $cells,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $cell = Cell::with(['dinosaurs', 'tasks.user'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Celda obtenida correctamente',
            'data' => $cell,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'row' => 'required|integer|min:1',
            'col' => 'required|integer|min:1',
            'security_level' => 'required|integer|min:0|max:100',
            'food_level' => 'required|integer|min:0|max:100',
            'pending_repairs' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        // evitar duplicar celdas (misma fila y columna)
        $exists = Cell::where('row', $data['row'])
            ->where('col', $data['col'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ya existe una celda en esa posicion',
            ], 422);
        }

        $cell = Cell::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Celda creada correctamente',
            'data' => $cell,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $cell = Cell::findOrFail($id);

        $data = $request->validate([
            'security_level' => 'sometimes|integer|min:0|max:100',
            'food_level' => 'sometimes|integer|min:0|max:100',
            'pending_repairs' => 'sometimes|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $cell->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Celda actualizada correctamente',
            'data' => $cell,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $cell = Cell::findOrFail($id);
        $cell->delete();

        return response()->json([
            'success' => true,
            'message' => 'Celda eliminada correctamente',
        ]);
    }
}