<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CharacterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $level = $this->faker->numberBetween(1, 99);
        $previous_level = 0;
        $next_level = 0;
        $level_gap = 250;
        for ($e = 0; $e < $level; $e++) {
            $previous_level = $next_level;

            if ($e % 10 == 0 && $e != 0) {
                $level_gap = $level_gap + round(300 * 1.5 ^ floor($level / 10));
            }
            $next_level = $next_level + $level_gap;
        }
        /*Level calculations */

        $exp = $this->faker->numberBetween($previous_level, $next_level);

        $stats = [10, 10, 10, 10, 10, 10]; //Str,dex,mag,vit,speed

        $not_spent = $this->faker->numberBetween(0, $level);

        for ($i = 1; $i < $level - $not_spent; $i++) {
            $stats[$this->faker->numberBetween(0, 4)]++;
        }


        /*Health Calculations */
        $maxHealth = 200;
        $bonus = 10;
        $vit_bonus = 10;
        $vit_health = 0;
        for ($h = 1; $h < $level; $h++) {
            if ($h % 10 == 0) {
                $bonus = round($bonus * 1.5);
            }
            $maxHealth = $maxHealth + $bonus;
        }
        for ($v = 0; $v < $stats[3]; $v++) {
            $vit_health = $vit_health + $vit_bonus;
            if ($v < 40) {
                $vit_bonus = round($vit_bonus * 1.02);
            } else {
                $vit_bonus = round($vit_bonus * 0.9);
            }
        }

        $maxHealth = $maxHealth + $vit_health;

        return [
            'name' => $this->faker->userName(),

            'level' => $level,
            'exp' => $exp,
            'talent_points' => $not_spent,

            'strength' => $stats[0],
            'dexterity' => $stats[1],
            'magic' => $stats[2],
            'vitality' => $stats[3],
            'speed' => $stats[4],

            'maxHealth' => $maxHealth,
            'health' => $this->faker->numberBetween(1, $maxHealth), //Nagy esélyekkel nem lesz használva

            'gold' => $this->faker->numberBetween(100, 8000),

            'store_timer' => $this->faker->dateTimeBetween('-2 hour', '+2 hour'),

            "totalGold" => $this->faker->numberBetween(0, 250),
            "totalBattles" => $this->faker->numberBetween(0, 250),
            "totalBattlesWon" => $this->faker->numberBetween(0, 250),

        ];
    }
}
