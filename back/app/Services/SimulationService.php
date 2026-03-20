<?php

namespace App\Services;

use App\Enums\SimulationResult;
use App\Enums\SimulationType;
use App\Events\CellUpdated;
use App\Events\SimulationFinished;
use App\Models\Cell;
use App\Models\Simulation;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SimulationService
{
    public function __construct(
        protected TaskService $taskService
    ) {
    }

    public function runNormal(?array $cellIds, User $user): Simulation
    {
        return DB::transaction(function () use ($cellIds, $user) {
            $cells = Cell::query()
                ->when(!empty($cellIds), function ($query) use ($cellIds) {
                    $query->whereIn('id', $cellIds);
                })
                ->get();

            $report = [];

            foreach ($cells as $cell) {
                $foodDecrease = rand(10, 35);
                $newRepairs = rand(0, 3);

                $oldFood = $cell->food_level;
                $oldRepairs = $cell->pending_repairs;

                $cell->food_level = max(0, $cell->food_level - $foodDecrease);
                $cell->pending_repairs = $cell->pending_repairs + $newRepairs;
                $cell->save();

                if ($cell->food_level <= 30) {
                    $this->taskService->createFeedingTask($cell, 1);
                }

                if ($newRepairs > 0) {
                    $priority = $cell->pending_repairs >= 3 ? 1 : 2;
                    $this->taskService->createMaintenanceTask($cell, $priority);
                }

                broadcast(new CellUpdated($cell));

                $report[] = [
                    'cell_id' => $cell->id,
                    'position' => [
                        'row' => $cell->row,
                        'col' => $cell->col,
                    ],
                    'food_before' => $oldFood,
                    'food_after' => $cell->food_level,
                    'repairs_before' => $oldRepairs,
                    'repairs_after' => $cell->pending_repairs,
                    'generated_repairs' => $newRepairs,
                ];
            }

            $simulation = Simulation::create([
                'type' => SimulationType::NORMAL->value,
                'result' => SimulationResult::OK->value,
                'triggered_by' => $user->id,
                'affected_cell_id' => null,
                'report' => [
                    'cells_processed' => count($report),
                    'cells' => $report,
                ],
            ]);

            broadcast(new SimulationFinished($simulation));

            return $simulation;
        });
    }

    public function runBreach(?int $cellId, bool $random, User $user): Simulation
    {
        return DB::transaction(function () use ($cellId, $random, $user) {
            $cell = $this->resolveBreachCell($cellId, $random);

            $dangerousDinosaurs = $cell->dinosaurs()
                ->whereIn('danger_level', ['HIGH', 'VERY_HIGH', 'EXTREME', 'CRITICAL', 'ALTO', 'MUY_ALTO', 'EXTREMO', 'CRITICO'])
                ->count();

            $totalDinosaurs = $cell->dinosaurs()->count();

            $riskScore = 0;

            if ($cell->security_level <= 30) {
                $riskScore += 45;
            } elseif ($cell->security_level <= 50) {
                $riskScore += 30;
            } elseif ($cell->security_level <= 70) {
                $riskScore += 15;
            }

            if ($cell->food_level <= 25) {
                $riskScore += 20;
            } elseif ($cell->food_level <= 50) {
                $riskScore += 10;
            }

            $riskScore += $cell->pending_repairs * 8;
            $riskScore += $dangerousDinosaurs * 12;

            $roll = rand(1, 100);
            $escaped = $roll <= $riskScore;

            $securityLoss = rand(5, 20);
            $repairIncrease = rand(1, 4);

            $oldSecurity = $cell->security_level;
            $oldRepairs = $cell->pending_repairs;

            $cell->security_level = max(0, $cell->security_level - $securityLoss);
            $cell->pending_repairs = $cell->pending_repairs + $repairIncrease;
            $cell->save();

            $this->taskService->createSecurityTask($cell, 1);
            $this->taskService->createMaintenanceTask($cell, 1);

            if ($cell->food_level <= 30) {
                $this->taskService->createFeedingTask($cell, 1);
            }

            broadcast(new CellUpdated($cell));

            $result = $escaped
                ? SimulationResult::ESCAPE->value
                : SimulationResult::CONTAINED->value;

            $simulation = Simulation::create([
                'type' => SimulationType::BREACH->value,
                'result' => $result,
                'triggered_by' => $user->id,
                'affected_cell_id' => $cell->id,
                'report' => [
                    'cell_id' => $cell->id,
                    'position' => [
                        'row' => $cell->row,
                        'col' => $cell->col,
                    ],
                    'total_dinosaurs' => $totalDinosaurs,
                    'dangerous_dinosaurs' => $dangerousDinosaurs,
                    'security_before' => $oldSecurity,
                    'security_after' => $cell->security_level,
                    'repairs_before' => $oldRepairs,
                    'repairs_after' => $cell->pending_repairs,
                    'food_level' => $cell->food_level,
                    'risk_score' => $riskScore,
                    'roll' => $roll,
                    'escaped' => $escaped,
                ],
            ]);

            broadcast(new SimulationFinished($simulation));

            return $simulation;
        });
    }

    protected function resolveBreachCell(?int $cellId, bool $random): Cell
    {
        if ($random || !$cellId) {
            return Cell::query()->inRandomOrder()->firstOrFail();
        }

        return Cell::query()->findOrFail($cellId);
    }
}