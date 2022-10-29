<?php

namespace App\Http\Controllers;

use App\Models\Stash;
use App\Models\Type;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function userStash()
    {
        $stash = Stash::where(
            'character_id',
            Auth::user()->character->id
        )->paginate(5);

        $types = Type::all();
        return view('Stash', ['stash' => $stash, 'types' => $types]);
    }
}
