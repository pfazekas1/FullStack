<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\Stash;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory(rand(10, 15))->create();
        Character::factory(rand(10, 15))->create();
        Stash::factory(rand(10, 15))->create();
    }
}
