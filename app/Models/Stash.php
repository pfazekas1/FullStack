<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stash extends Model
{
    use HasFactory;
    protected $fillable = ['character_id', 'type_id'];

    public function character()
    {
        return $this->belongsTo(Character::class);
    }
    public function type()
    {
        return $this->belongsTo(Type::class);
    }
}
