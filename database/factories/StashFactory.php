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
        $prefixes = json_decode(file_get_contents($path), true);

        return [
            'name' => $this->faker->randomElement($prefixes),
            'rarity' => 'normal',
            'bonus_s' => 0,
            'bonus_d' => 0,
            'bonus_m' => 0,
        ];
    }

    public function item_level($item_level, $type)
    {
        return $this->state(function (array $attributes) use ($item_level, $type) {
            /*Rarity Calculation */
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
                    $rarity = 'normal';
                    break;
            }

            $bonuses = [0, 0, 0]; //str, dex, mag
            $negatives = [0, 0, 0];

            $price = $this->faker->numberBetween($item_level * 10, $item_level * 40);

            switch ($rarity) {
                case 'normal':
                    $numberOfBonuses = $this->faker->numberBetween(0, 1);
                    $numberOfNegatives = $this->faker->numberBetween(0, 2);
                    break;
                case 'rare':
                    $numberOfBonuses = $this->faker->numberBetween(0, 2);
                    $numberOfNegatives = $this->faker->numberBetween(0, 1);

                    $price = $price * 1.2;
                    break;
                case 'epic':
                    $numberOfBonuses = $this->faker->numberBetween(0, 3);
                    $numberOfNegatives = $this->faker->numberBetween(0, 1);
                    $price = $price * 1.5;
                    break;
                case 'legendary':
                    $numberOfBonuses = $this->faker->numberBetween(0, 4);
                    $numberOfNegatives = $this->faker->numberBetween(0, 0);
                    $price = $price * 7;
                    break;

                default:
                    $numberOfBonuses = $this->faker->numberBetween(0, 1);
                    $numberOfNegatives = $this->faker->numberBetween(0, 1);
                    break;
            }

            for ($i = 0; $i < $numberOfBonuses; $i++) {
                $bonuses[$this->faker->numberBetween(0, 2)] += $this->faker->numberBetween(1, round($item_level * $this->faker->randomFloat(1, 0.1, 0.7)));
            }
            for ($i = 0; $i < $numberOfNegatives; $i++) {
                $negatives[$this->faker->numberBetween(0, 2)] += $this->faker->numberBetween(1, round($item_level * $this->faker->randomFloat(1, 0.1, 0.5)));
            }
            $damage = null;
            $armor = null;
            if ($type == "armor") {
                $armor = $this->faker->numberBetween(1, round($item_level * 1.2));
            } else {
                $damage = $this->faker->numberBetween(floor($item_level / 5) + 3, round(floor($item_level / 5) + 3 * 1.2));
            }
            return [
                'rarity' => $rarity,
                'bonus_s' => $bonuses[0] - $negatives[0],
                'bonus_d' => $bonuses[1] - $negatives[1],
                'bonus_m' => $bonuses[2] - $negatives[2],
                'item_level' => $item_level,
                'price' => round($price),

                'damage' => $damage,
                'armor' => $armor,
            ];
        });
    }
}
