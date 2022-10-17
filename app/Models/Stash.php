<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stash extends Model
{
    use HasFactory;

    public function character()
    {
        return $this->belongsTo(Character::class, 'characterId');
    }
    public function type()
    {
        return $this->belongsTo(Type::class);
    }
}
