<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProxiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proxies', function (Blueprint $table) {
            $table->id();
            $table->string('provider');
            $table->boolean('enabled', true);
            $table->string('location');

            $table->string('type');
            $table->string('ip');
            $table->string('port');
            $table->enum('auth_type', ['IP_WHITELIST', 'USER_PASS']);
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('batch_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proxies');
    }
}
