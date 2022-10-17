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

            //TODO:EZT INNEN VEDD KI!
            /*$table
                ->foreign('type')
                ->references('typeName')
                ->on('types')
                ->nullable();*/

            $table->string('name', 50);
            $table->enum('rarity', ['normal', 'rare', 'epic', 'legendary']);

            //TODO: BONUS AND NEGATIVE

            $table->integer('damage')->nullable();
            $table->integer('armor')->nullable();

            /*$table
                ->foreign('characterId')
                ->references('id')
                ->on('characters');
*/
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
