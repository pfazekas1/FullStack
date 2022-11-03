<?php

namespace Database\Seeders;

use App\Models\Character;
use App\Models\Monster;
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
            file_get_contents(database_path('data/Equipment.json')),
            true
        );

        $monster_data = json_decode(
            file_get_contents(database_path('data/Monsters.json')),
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
        foreach ($monster_data as $key => $data) {
            Monster::create([
                'name' => $data['name'],
                'key_ability' => $data['key_ability'],
                'file_path' => $data['file_path'],
            ]);
        }



        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@alma.com',
            'password' => bcrypt('asd123456'),
        ]);


        User::factory(rand(10, 15))->create();
        $users = User::all();
        $typesAll = Type::all();

        foreach ($users as $user) {
            Character::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        $characters = Character::all();
        foreach ($characters as $character) {
            for ($i = 0; $i < 6; $i++) {
                Stash::factory()->create([
                    'character_id' => $character->id,
                    'type_id' => Type::inRandomOrder()->first()->id,
                ]);
            }
            for ($i = 0; $i < 10; $i++) {
                Stash::factory()->create([
                    'character_id' => $character->id,
                    'type_id' => Type::inRandomOrder()->first()->id,
                    "store_item" => true,
                ]);
            }
        }

        foreach ($characters as $character) {
            $items = $character->stash()->get();
            foreach ($items as $item) {
                if ($item->store_item == false) {
                    switch ($item->type()->get()[0]->placementType) {
                        case 'head':
                            $character->update(['headId' => $item->id]);
                            break;
                        case 'body':
                            $character->update(['bodyId' => $item->id]);
                            break;
                        case 'legs':
                            $character->update(['legsId' => $item->id]);
                            break;
                        case 'weapon':
                            $character->update(['weaponId' => $item->id]);
                            break;
                    }
                }
            }
        }
    }
}
