<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\Stash;
use App\Models\Type;
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
        $types = json_decode(
            file_get_contents('database/data/Equipment.json'),
            true
        );

        foreach ($types as $key => $type) {
            Type::create([
                'name' => $type['name'],
                'equipmentType' => $type['equipmentType'],
                'placementType' => $type['placementType'],
                'file_path' => $type['file_path'],
            ]);
        }
        Character::factory(rand(10, 15))->create();
        $characters = Character::all();
        $typesAll = Type::all();

        foreach ($characters as $character) {
            User::factory()->create([
                'characterId' => $character->id,
            ]);
            Stash::factory()->create([
                'characterId' => $character->id,
                'typeId' => Type::inRandomOrder()->first()->id,
            ]);
        }
    }
}
