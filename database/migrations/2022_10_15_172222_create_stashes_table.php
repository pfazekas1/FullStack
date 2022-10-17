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

            $table->unsignedBigInteger('typeId');
            $table
                ->foreign('typeId')
                ->references('id')
                ->on('types');

            $table->string('name'); //This name is the prefix for the item
            $table->enum('rarity', ['normal', 'rare', 'epic', 'legendary']);

            $table->integer('damage')->nullable();
            $table->integer('armor')->nullable();

            $table->integer('Bonus_S')->nullable();
            $table->integer('Bonus_D')->nullable();
            $table->integer('Bonus_M')->nullable();

            $table->integer('Negative_S')->nullable();
            $table->integer('Negative_D')->nullable();
            $table->integer('Negative_M')->nullable();

            $table->unsignedBigInteger('characterId');
            $table
                ->foreign('characterId')
                ->references('id')
                ->on('characters');

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
