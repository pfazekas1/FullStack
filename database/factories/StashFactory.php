<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StashFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(), //TODO: WEAPON NAME PREFIXES
            'rarity' => $this->faker->randomElement([
                'normal',
                'rare',
                'epic',
                'legendary',
            ]),

            'damage' => $this->faker->randomNumber(1, 40),
            'armor' => $this->faker->randomNumber(1, 40),
        ];
    }
}
