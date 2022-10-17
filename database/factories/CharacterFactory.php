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
        $maxHealth = $this->faker->numberBetween(50, 80);
        return [
            'name' => $this->faker->userName(),

            'level' => $this->faker->numberBetween(1, 80),
            'strength' => $this->faker->numberBetween(1, 80),
            'dexterity' => $this->faker->numberBetween(1, 80),
            'magic' => $this->faker->numberBetween(1, 80),

            'maxHealth' => $maxHealth,
            'health' => $this->faker->numberBetween(1, $maxHealth),

            'gold' => $this->faker->numberBetween(100, 800),
        ];
    }
}
