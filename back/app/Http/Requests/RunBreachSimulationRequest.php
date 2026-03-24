<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RunBreachSimulationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'random' => ['required', 'boolean'],
            'cell_id' => [
                Rule::requiredIf(fn () => ! $this->boolean('random')),
                'nullable',
                'integer',
                'exists:cells,id',
            ],
        ];
    }
}