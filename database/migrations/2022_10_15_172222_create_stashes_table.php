<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStashesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stashes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('type_id');
            $table
                ->foreign('type_id')
                ->references('id')
                ->on('types');

            $table->string('name'); //This name is the prefix for the item
            $table->enum('rarity', ['normal', 'rare', 'epic', 'legendary']);

            $table->integer('damage')->nullable();
            $table->integer('armor')->nullable();

            $table->integer('bonus_s')->nullable();
            $table->integer('bonus_d')->nullable();
            $table->integer('bonus_m')->nullable();

            $table->unsignedBigInteger('character_id');
            $table
                ->foreign('character_id')
                ->references('id')
                ->on('characters');

            $table->boolean('store_item')->default(false);

            $table->integer('price');

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
        Schema::dropIfExists('stashes');
    }
}
