<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchCreateProxyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "proxies.*.provider" => "required",
            "proxies.*.location" => "required",
            "proxies.*.type" => "required",
            "proxies.*.ip" => "required|ip|unique:proxies",
            "proxies.*.port" => "required|",
            "proxies.*.auth_type" => "required",
            "proxies.*.username" => "required_if:auth_type,USER_PASS",
            "proxies.*.password" => "required_if:auth_type,USER_PASS"
        ];
    }
}
