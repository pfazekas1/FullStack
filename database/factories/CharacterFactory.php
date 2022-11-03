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

        $level = $this->faker->numberBetween(1, 80);
        $exp = 0 + 1000 * $level + $this->faker->numberBetween(0, 999); //next_level_requirement = 1000*(level+1)

        $stats = [10, 10, 10, 10, 10, 10]; //Str,dex,mag,vit,speed

        $not_spent = $this->faker->numberBetween(0, $level);

        for ($i = 1; $i < $level - $not_spent; $i++) {
            $stats[$this->faker->numberBetween(0, 4)]++;
        }

        $maxHealth = $level * (10 + $stats[3]);
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
            'health' => $this->faker->numberBetween(1, $maxHealth),

            'gold' => $this->faker->numberBetween(100, 800),

            'store_timer' => $this->faker->dateTimeBetween('-2 hour', '+2 hour')


        ];
    }
}
