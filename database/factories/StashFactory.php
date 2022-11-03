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
        $path = database_path('data/Prefixes.json');
        $prefixes = json_decode(
            file_get_contents($path),
            true
        );


        $rarity_roll = $this->faker->numberBetween(1, 20);
        switch (true) {
            case in_array($rarity_roll, range(1, 10)): //50%
                $rarity = 'normal';
                break;
            case in_array($rarity_roll, range(11, 16)): //30%
                $rarity = 'rare';
                break;
            case in_array($rarity_roll, range(17, 19)): //15%
                $rarity = 'epic';
                break;
            case in_array($rarity_roll, range(20, 20)): //5%
                $rarity = 'legendary';
                break;

            default:
                $rarity = "normal";
                break;
        }

        $bonuses = [0, 0, 0]; //str, dex, mag
        $negatives = [0, 0, 0];

        switch ($rarity) {
            case 'normal':
                $numberOfBonuses = $this->faker->numberBetween(0, 1);
                $numberOfNegatives = $this->faker->numberBetween(0, 2);
                break;
            case 'rare':
                $numberOfBonuses = $this->faker->numberBetween(0, 2);
                $numberOfNegatives = $this->faker->numberBetween(0, 1);
                break;
            case 'epic':
                $numberOfBonuses = $this->faker->numberBetween(0, 3);
                $numberOfNegatives = $this->faker->numberBetween(0, 1);
                break;
            case 'legendary':
                $numberOfBonuses = $this->faker->numberBetween(0, 4);
                $numberOfNegatives = $this->faker->numberBetween(0, 0);
                break;

            default:
                $numberOfBonuses = $this->faker->numberBetween(0, 1);
                $numberOfNegatives = $this->faker->numberBetween(0, 1);
                break;
        }

        for ($i = 0; $i < $numberOfBonuses; $i++) {
            $bonuses[$this->faker->numberBetween(0, 2)] += $this->faker->numberBetween(1, 10);
        }
        for ($i = 0; $i < $numberOfNegatives; $i++) {
            $negatives[$this->faker->numberBetween(0, 2)] += $this->faker->numberBetween(1, 10);
        }

        return [
            'name' => $this->faker->randomElement($prefixes),
            'rarity' => $rarity,

            'damage' => $this->faker->numberBetween(1, 40),
            'armor' => $this->faker->numberBetween(1, 40),

            'bonus_s' => $bonuses[0],
            'bonus_d' => $bonuses[1],
            'bonus_m' => $bonuses[2],

            'negative_s' => $negatives[0],
            'negative_d' => $negatives[1],
            'negative_m' => $negatives[2],
            'price' => $this->faker->numberBetween(0, 500),
        ];
    }
}
