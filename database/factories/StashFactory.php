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
        $bonuses = [0, 0, 0]; //str, dex, mag
        $negatives = [0, 0, 0];

        $numberOfBonuses = $this->faker->numberBetween(0, 3);
        $numberOfNegatives = $this->faker->numberBetween(0, 3);

        for ($i = 0; $i < $numberOfBonuses; $i++) {
            $bonuses[
                $this->faker->numberBetween(0, 2)
            ] += $this->faker->numberBetween(1, 10);
        }
        for ($i = 0; $i < $numberOfNegatives; $i++) {
            $negatives[
                $this->faker->numberBetween(0, 2)
            ] += $this->faker->numberBetween(1, 10);
        }

        return [
            'name' => $this->faker->name(), //TODO: WEAPON NAME PREFIXES
            'rarity' => $this->faker->randomElement([
                'normal',
                'rare',
                'epic',
                'legendary',
            ]),

            'damage' => $this->faker->numberBetween(1, 40),
            'armor' => $this->faker->numberBetween(1, 40),

            'Bonus_S' => $bonuses[0],
            'Bonus_D' => $bonuses[1],
            'Bonus_M' => $bonuses[2],

            'Negative_S' => $negatives[0],
            'Negative_D' => $negatives[1],
            'Negative_M' => $negatives[2],
        ];
    }
}
