<?php

namespace App\Http\Controllers;

use App\Http\Requests\RunBreachSimulationRequest;
use App\Http\Requests\RunNormalSimulationRequest;
use App\Services\SimulationService;
use Illuminate\Http\JsonResponse;

class SimulationController extends Controller
{
    public function __construct(
        protected SimulationService $simulationService
    ) {
    }

    public function runNormal(RunNormalSimulationRequest $request): JsonResponse
    {
        $this->ensureAdmin();

        $simulation = $this->simulationService->runNormal(
            $request->input('cell_ids'),
            $request->user()
        );

        return response()->json([
            'success' => true,
            'message' => 'Simulacion normal ejecutada con exito',
            'data' => $simulation,
        ]);
    }

    public function runBreach(RunBreachSimulationRequest $request): JsonResponse
    {
        $this->ensureAdmin();

        $simulation = $this->simulationService->runBreach(
            $request->input('cell_id'),
            (bool) $request->input('random', false),
            $request->user()
        );

        return response()->json([
            'success' => true,
            'message' => 'Simulacion de brecha ejecutada con exito',
            'data' => $simulation,
        ]);
    }

    protected function ensureAdmin(): void
    {
        if (auth()->user()->role !== 'ADMIN') {
            abort(403, 'Solo un administrador puede lanzar simulaciones');
        }
    }
}