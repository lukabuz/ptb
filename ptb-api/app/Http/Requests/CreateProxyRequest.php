<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProxyRequest extends FormRequest
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
            "provider" => "required",
            "location" => "required",
            "type" => "required",
            "ip" => "required|ip|unique:proxies",
            "port" => "required|",
            "auth_type" => "required",
            "username" => "required_if:auth_type,USER_PASS",
            "password" => "required_if:auth_type,USER_PASS"
        ];
    }
}
