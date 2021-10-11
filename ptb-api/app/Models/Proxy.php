<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proxy extends Model
{
    use HasFactory;

    protected $fillable = [
        "provider",
        "enabled",
        "location",
        "type",
        "ip",
        "port",
        "auth_type",
        "username",
        "password"
    ];
}
