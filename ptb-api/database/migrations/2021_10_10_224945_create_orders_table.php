<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('destination_url');
            $table->boolean('use_redirect_link', true);
            $table->string('redirect_url')->nullable();

            $table->json('referrers');
            $table->json('locations');
            $table->json('keywords');
            $table->integer('page_idle_time');

            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->json('visitor_counts');

            $table->enum('status', ['CREATED', 'PAYMENT_PENDING', 'PAYMENT_FAIL', 'IN_PROGRESS', 'CLOSED', 'COMPLETED']);
            $table->string('closing_reason')->nullable();
            $table->boolean('is_paid', false);

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
        Schema::dropIfExists('orders');
    }
}
