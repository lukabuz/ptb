<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        "order_id",
        "proxy_id",
        "status",
        "execute_after",
        "referrer",
        "keyword",
        "executed_on"
    ];
}
