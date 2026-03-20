<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cell;
use Illuminate\Http\Request;

class CellController extends Controller
{
    public function index(): JsonResponse
    {
        $cells = Cell::with('dinosaurs')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Celdas obtenidas correctamente',
            'data' => $cells,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $cell = Cell::with('dinosaurs')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Celda obtenida correctamente',
            'data' => $cell,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'row' => 'required|integer',
            'col' => 'required|integer',
            'security_level' => 'required|integer|min:0|max:100',
            'food_level' => 'required|integer|min:0|max:100',
            'pending_repairs' => 'required|integer|min:0',
            'notes' => 'nullable|string'
        ]);

        $cell = Cell::create($data);

        return response()->json($cell, 201);
    }

    public function update(Request $request, $id)
    {
        $cell = Cell::findOrFail($id);

        $data = $request->validate([
            'security_level' => 'integer|min:0|max:100',
            'food_level' => 'integer|min:0|max:100',
            'pending_repairs' => 'integer|min:0',
            'notes' => 'nullable|string'
        ]);

        $cell->update($data);

        return response()->json($cell);
    }

    public function destroy($id)
    {
        $cell = Cell::findOrFail($id);

        $cell->delete();

        return response()->json([
            'message' => 'Cell deleted'
        ]);
    }
}