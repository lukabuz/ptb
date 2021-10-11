<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->unsignedBigInteger('proxy_id')->nullable();
            $table->foreign('proxy_id')->references('id')->on('proxies')->onDelete('set null');
            $table->string('referrer');
            $table->string('keyword');
            $table->string('user_agent');
            $table->string("destination_url");

            $table->string('status');
            $table->timestamp('execute_after')->nullable();
            $table->timestamp('executed_on')->nullable();
            $table->longText('error_dump')->nullable();

            $table->string('node_id')->nullable();

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
        Schema::dropIfExists('jobs');
    }
}
