<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCharactersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->integer('level');

            $table->integer('strength');
            $table->integer('dexterity');
            $table->integer('magic');

            $table->integer('health');
            $table->integer('maxHealth');

            $table->integer('gold');

            //Equipment id
            /*$table
                ->foreign('headId')
                ->references('id')
                ->on('stash')
                ->nullable();
            $table
                ->foreign('bodyId')
                ->references('id')
                ->on('stash')
                ->nullable();
            $table
                ->foreign('legsId')
                ->references('id')
                ->on('stash')
                ->nullable();*/

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
        Schema::dropIfExists('characters');
    }
}
