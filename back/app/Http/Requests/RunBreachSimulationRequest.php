<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RunBreachSimulationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cell_id' => ['nullable', 'integer', 'exists:cells,id'],
            'random' => ['nullable', 'boolean'],
        ];
    }
}