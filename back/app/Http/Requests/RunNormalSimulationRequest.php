<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RunNormalSimulationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cell_ids' => ['nullable', 'array'],
            'cell_ids.*' => ['integer', 'exists:cells,id'],
        ];
    }
}