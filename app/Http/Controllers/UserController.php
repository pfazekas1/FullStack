<?php

namespace App\Http\Controllers;

use App\Models\Character;
use App\Models\Monster;
use App\Models\Stash;
use App\Models\Type;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;

class UserController extends Controller
{
    public function userStash()
    {
        $stash = Stash::where(
            'character_id',
            Auth::user()->character->id
        )->get();

        $types = Type::all();
        $equiped_ids = [Auth::user()->character->headId, Auth::user()->character->bodyId, Auth::user()->character->legsId, Auth::user()->character->weaponId];

        return view('Stash', ['stash' => $stash, 'types' => $types, 'equiped_ids' => $equiped_ids]);
    }

    public function userStore()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }
        $character = User::findorFail(Auth::id())->character;
        $types = Type::all(); //TODO: MAJD NE AZ ÖSSZESETT ADD TOVÁBB CSAK AMI KELL!
        $oldTimer = Carbon::parse($character->store_timer);

        if (Carbon::now()->gt($oldTimer->addHours(2))) {
            Stash::factory(10)->create([
                'character_id' => $character->id,
                'type_id' => Arr::random($types->toArray())["id"],
                'store_item' => true
            ]);

            $store = Stash::where('character_id', 1)->where('store_item', true)->get();
            $character->store_timer = Carbon::now()->addHours(2);

            //ONLY TO SHOWCASE:
            $newTimer = $character->store_timer;

            $character->save();

            //ONLY TO SHOWCASE:
            return view('Store', ['store' => $store, 'types' => $types, 'character' => $character, 'oldTimer' => $oldTimer, 'newTimer' => $newTimer]);
        } else {
            $store = Stash::where('character_id', 1)->where('store_item', true)->get();
        }

        return view('Store', ['store' => $store, 'types' => $types, 'character' => $character, 'oldTimer' => $oldTimer, 'newTimer' => 0]);
    }
    public function userBought(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }


        $id = $request->post()["id"];
        $user = Auth::id();
        $character = Auth::user()->character;
        //var_dump($data);

        $bought_item = Stash::findorFail($id);

        if ($bought_item->price <= $character->gold) {

            $character->gold = $character->gold - $bought_item->price;

            $bought_item->store_item = false;
            $bought_item->save();
            $character->save();
        } else {
            //TODO: KÜLDJ VISSZA ERRORT, HOGY NEM VOLT ELÉG PÉNZED!
        }
        return redirect("/store");
    }
    public function userSheet()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $types = Type::all(); //TODO: ENNÉL EGY KICSIT SOK MEMÓRIÁT FOG ENNI,HA SOK ADATT VAN CSAK AMI KELL AZ LEGYEN OTT!
        $character = User::findorFail(Auth::id())->character()->get()[0];

        $items["head"] = Stash::find($character->headId)  == null ? null : Stash::find($character->headId);
        $items["body"] = Stash::find($character->bodyId)  == null ? null : Stash::find($character->bodyId);
        $items["legs"] = Stash::find($character->legsId)  == null ? null : Stash::find($character->legsId);
        $items["weapon"] = Stash::find($character->weaponId) == null ? null : Stash::find($character->weaponId);

        return view('Sheet', ['character' => $character, 'items' => $items, 'types' => $types]);
    }
    public function userUpgrade(Request $request)
    {
        $data = $request->all();
        $upgrade_type = $data["type"];

        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;
        $character->talent_points -= 1;

        switch ($upgrade_type) {
            case 'str':
                $character->strength += 1;
                break;
            case 'dex':
                $character->dexterity += 1;
                break;
            case 'mag':
                $character->magic += 1;
                break;
            case 'vit':
                $character->vitality += 1;
                break;
            case 'spe':
                $character->speed += 1;
                break;
            default:
                //TODO: ERRORT DOB ILYENKOR
                break;
        }

        $character->maxHealth = $character->level * (10 + $character->vitality);

        $character->save();

        return redirect()->route('user.sheet');
    }
    public function userRespec()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;
        $character->talent_points = $character->level - 1;

        $character->strength = 10;
        $character->dexterity = 10;
        $character->magic = 10;
        $character->vitality = 10;
        $character->speed = 10;

        $character->gold = $character->gold - ($character->level * 100 * 1.35);
        $character->maxHealth = $character->level * (10 + $character->vitality);
        if ($character->health > $character->maxHealth)
            $character->health = $character->maxHealth;


        $character->save();

        return redirect()->route('user.sheet');
    }


    public function userEquip(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $data = $request->all();
        var_dump($data);

        $type = $data["placementType"];
        $character = Character::findorFail(Auth::id());
        $unequip = filter_var($data["unequip"], FILTER_VALIDATE_BOOLEAN);

        if (!$unequip) {
            switch ($type) {
                case 'head':
                    $character->headId = $data["id"];
                    break;
                case 'body':
                    $character->bodyId = $data["id"];
                    break;
                case 'legs':
                    $character->legsId = $data["id"];
                    break;
                case 'weapon':
                    $character->weaponId = $data["id"];
                    break;
                default:
                    //TODO: ERROR CHECK IDE
                    break;
            }
        } else {
            switch ($type) {
                case 'head':
                    $character->headId = null;
                    break;
                case 'body':
                    $character->bodyId = null;
                    break;
                case 'legs':
                    $character->legsId = null;
                    break;
                case 'weapon':
                    $character->weaponId = null;
                    break;
                default:
                    //TODO: ERROR CHECK IDE
                    break;
            }
        }

        $character->save();

        return redirect('/stash');
    }

    public function userSell(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $id = $request->post()["id"];
        $character = Auth::user()->character;
        $unequip = filter_var($request->post()["unequip"], FILTER_VALIDATE_BOOLEAN);


        $item = Stash::findorFail($id);

        if ($unequip == true) {
            switch ($item->type->placementType) {
                case 'head':
                    $character->headId = null;
                    break;
                case 'body':
                    $character->bodyId = null;
                    break;
                case 'legs':
                    $character->legsId = null;
                    break;
                case 'weapon':
                    $character->weaponId = null;
                    break;
                default:
                    //TODO: ERROR CHECK IDE
                    break;
            }
        }

        $character->gold = $character->gold + $item->price;

        $character->save();
        $item->delete();


        return redirect('/stash');
    }

    public function userMonsterGen()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;
        $all_monsters = Monster::all();


        for ($i = 0; $i < 3; $i++) {

            $template = Arr::random($all_monsters->toArray());
            $level = rand($character->level - 5, $character->level + 5);
            $stats = [10, 10, 10, 10, 10];

            switch ($template["key_ability"]) {
                case 'strength':
                    $key_ability_index = 0;
                    break;
                case 'dexterity':
                    $key_ability_index = 1;
                    break;
                case 'magic':
                    $key_ability_index = 2;
                    break;
                default:
                    break;
            }

            for ($p = 0; $p < $level - 1; $p++) {
                switch (rand(0, 6)) {
                    case 0:
                        $stats[0] += 1;
                        break;
                    case 1:
                        $stats[1] += 1;
                        break;
                    case 2:
                        $stats[2] += 1;
                        break;
                    case 3:
                        $stats[3] += 1;
                        break;
                    case 4:
                        $stats[4] += 1;
                        break;
                    default:
                        $stats[$key_ability_index] += 1;
                        break;
                }
            }

            $monsters[] = (object) array(
                "name" => $template["name"],
                "key_ability" => $template["key_ability"],
                "level" => $level,

                "strength" => $stats[0],
                "dexterity" => $stats[1],
                "magic" => $stats[2],
                "vitality" => $stats[3],
                "speed" => $stats[4],

                "hp" => ($stats[3] * 10) * $level,
                "defense" => round(($stats[1] * 1.15) + ($stats[3] * 1.5))
            );
        }


        return view('Combat', ["monsters" => $monsters]);
    }

    public function userCombatGen(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }
        $data = $request->all();
        $monster = json_decode($data["monsterData"]);
        $character = Auth::user()->character;

        $head = Stash::find($character->headId);
        $body = Stash::find($character->bodyId);
        $legs = Stash::find($character->legsId);
        $weapon = Stash::find($character->weaponId);


        $turn = 1;

        //var_dump($monster);
        $monster = (array)$monster;
        $monster["maxHP"] = $monster["hp"];

        $player_armor = ($character->headId != null ? $head->armor : 0) + ($character->bodyId != null ? $body->armor : 0) + ($character->legsId != null ? $legs->armor : 0);

        $player_stats = [
            $character->strength
                + ($character->headId != null ? $head->bonus_s : 0) +
                ($character->headId != null ? $head->negative_s : 0) +
                ($character->bodyId != null ? $body->bonus_s : 0) +
                ($character->bodyId != null ? $body->negative_s : 0) +
                ($character->legsId != null ? $legs->bonus_s : 0) +
                ($character->legsId != null ? $legs->negative_s : 0),
            $character->dexterity
                + ($character->headId != null ? $head->bonus_d : 0) +
                ($character->headId != null ? $head->negative_d : 0) +
                ($character->bodyId != null ? $body->bonus_d : 0) +
                ($character->bodyId != null ? $body->negative_d : 0) +
                ($character->legsId != null ? $legs->bonus_d : 0) +
                ($character->legsId != null ? $legs->negative_d : 0),
            $character->magic
                + ($character->headId != null ? $head->bonus_m : 0) +
                ($character->headId != null ? $head->negative_m : 0) +
                ($character->bodyId != null ? $body->bonus_m : 0) +
                ($character->bodyId != null ? $body->negative_m : 0) +
                ($character->legsId != null ? $legs->bonus_m : 0) +
                ($character->legsId != null ? $legs->negative_m : 0),
            $character->vitality,
            $character->speed
        ];

        $won = "";
        while ($character->health > 0 && $monster["hp"] > 0) {
            if ($player_stats[4] > $monster["speed"]) {
                $monster["hp"] -= $weapon->damage;

                if ($monster["hp"] <= 0 && $won != "monster")
                    $won = "player";
                $character->health -= floor($monster[$monster["key_ability"]] + $monster["level"]);

                if ($character->health <= 0 && $won != "player")
                    $won = "monster";
                $results[$turn]["player_hp"] = $character->health;
                $results[$turn]["monster_hp"] = $monster["hp"];

                $turn += 1;
            } else {
                $character->health -= $monster[$monster["key_ability"]] + 1.5 * $monster["level"];

                if ($character->health <= 0 && $won != "player")
                    $won = "monster";
                $monster["hp"] -= $weapon->damage;

                if ($monster["hp"] <= 0 && $won != "monster")
                    $won = "player";
                $results[$turn]["player_hp"] = $character->health;
                $results[$turn]["monster_hp"] = $monster["hp"];

                $turn += 1;
            }
        }
        $results["won"] = $won;

        //TODO: DAMAGE ÁTADÁSA
        //TODO: HP-> elmentése a playeren
        //TODO: reward generálása

        return view('Combat', ["results" => $results]);
    }
}
