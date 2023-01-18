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
    public function authCsrf()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $res = ['csrf' => csrf_token()];
        return response()->json($res, 200);
    }

    public function userStash()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $skip = null; // Ha kell skip itt legyen lekérve
        $limit = null; // Ha kell limit itt legyen lekérve

        $stash = Stash::where(
            'character_id',
            Auth::user()->character->id
        )->where('store_item', false)->get();

        $types = Type::all();
        $equiped_ids = [
            Auth::user()->character->headId,
            Auth::user()->character->bodyId,
            Auth::user()->character->legsId,
            Auth::user()->character->weaponId,
        ];
        $character = Auth::user()->character;

        //return view('Stash', ['stash' => $stash, 'types' => $types, 'equiped_ids' => $equiped_ids]);

        $res = [
            'data' => [
                'stash' => $stash,
                'types' => $types,
                'equiped_ids' => $equiped_ids,
                'character' => $character,
            ],
            'total' => $stash->count(),
            'skip' => $skip,
            'limit' => $limit,
        ];
        return response()->json($res, 200);
    }
    public function userStore()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $skip = null; // Ha kell skip itt legyen lekérve
        $limit = null; // Ha kell limit itt legyen lekérve

        $types = Type::all();
        $equiped_ids = [
            Auth::user()->character->headId,
            Auth::user()->character->bodyId,
            Auth::user()->character->legsId,
            Auth::user()->character->weaponId,
        ];
        $character = Auth::user()->character;

        //return view('Stash', ['stash' => $stash, 'types' => $types, 'equiped_ids' => $equiped_ids]);

        $oldTimer = Carbon::parse($character->store_timer);

        if (Carbon::now()->gt($oldTimer->addHours(2))) {


            $oldStore = Stash::where(
                'character_id',
                Auth::user()->character->id
            )->where('store_item', true)->delete();


            for ($i = 0; $i < 15; $i++) {
                $item_level = rand(round($character->level * 0.9), $character->level);
                while ($item_level < 1) {
                    $item_level = rand(round($character->level * 0.9), $character->level);
                }
                $type = Type::inRandomOrder()->first();
                Stash::factory()->item_level($item_level, $type->equipmentType)->create([
                    'character_id' => $character->id,
                    'type_id' => $type->id,
                    'store_item' => true
                ]);
            }

            $character->store_timer = Carbon::now()->addHours(2);

            $character->save();
        }

        $stash = Stash::where(
            'character_id',
            Auth::user()->character->id
        )->where('store_item', true)->get();

        $res = [
            'data' => [
                'stash' => $stash,
                'types' => $types,
                'equiped_ids' => $equiped_ids,
                'character' => $character,
            ],
            'total' => $stash->count(),
            'skip' => $skip,
            'limit' => $limit,
        ];
        return response()->json($res, 200);
    }
    public function userBought(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $id = $request->header('id');
        $character = Auth::user()->character;

        $bought_item = Stash::findorFail($id);
        if ($bought_item->store_item) {
            if ($bought_item->price <= $character->gold) {
                $character->gold = $character->gold - $bought_item->price;

                $bought_item->store_item = false;
                $bought_item->save();
                $character->save();
            }
        }

        return $this->userStore();
    }
    public function userSheet()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $types = Type::all(); //TODO: ENNÉL EGY KICSIT SOK MEMÓRIÁT FOG ENNI,HA SOK ADATT VAN CSAK AMI KELL AZ LEGYEN OTT!
        $character = User::findorFail(Auth::id())
            ->character()
            ->get()[0];

        $items['head'] =
            Stash::find($character->headId) == null
            ? null
            : Stash::find($character->headId);
        $items['body'] =
            Stash::find($character->bodyId) == null
            ? null
            : Stash::find($character->bodyId);
        $items['legs'] =
            Stash::find($character->legsId) == null
            ? null
            : Stash::find($character->legsId);
        $items['weapon'] =
            Stash::find($character->weaponId) == null
            ? null
            : Stash::find($character->weaponId);

        return view('Sheet', [
            'character' => $character,
            'items' => $items,
            'types' => $types,
        ]);
    }
    public function userUpgrade(Request $request)
    {

        $upgrade_type = $request->header('stat');

        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;

        if ($character->talent_points > 0) {
            switch ($upgrade_type) {
                case 'strength':
                    $character->talent_points -= 1;
                    $character->strength += 1;
                    break;
                case 'dexterity':
                    $character->talent_points -= 1;
                    $character->dexterity += 1;
                    break;
                case 'magic':
                    $character->talent_points -= 1;
                    $character->magic += 1;
                    break;
                case 'vitality':
                    $character->talent_points -= 1;
                    $character->vitality += 1;
                    $character->maxHealth = $this->hpCalc($character->level, $character->vitality);
                    break;
                case 'speed':
                    $character->talent_points -= 1;
                    $character->speed += 1;
                    break;
                default:
                    //TODO: ERRORT DOB ILYENKOR
                    break;
            }
        }

        $character->save();

        return $this->userStash();
    }
    public function userRespec()
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;
        if ($character->gold - round($character->level * 100 * 1.35) >= 0) {
            $character->talent_points = $character->level - 1;

            $character->strength = 10;
            $character->dexterity = 10;
            $character->magic = 10;
            $character->vitality = 10;
            $character->speed = 10;

            $character->gold = $character->gold - round($character->level * 100 * 1.35);
            $character->maxHealth = $this->hpCalc($character->level, $character->vitality);

            $character->save();
        }

        return $this->userStash();
    }
    public function userRename(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $character = Auth::user()->character;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        var_dump($validated);

        $character->save();

        return $this->userStash();
    }

    public function userEquip(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        //var_dump($data);

        $type = $request->header('placementType');
        $character = Character::findorFail(Auth::id());
        $unequip = filter_var($request->header('unequip'), FILTER_VALIDATE_BOOLEAN);
        $id = $request->header('id');

        if (!$unequip) {
            switch ($type) {
                case 'head':
                    $character->headId = $id;
                    break;
                case 'body':
                    $character->bodyId = $id;
                    break;
                case 'legs':
                    $character->legsId = $id;
                    break;
                case 'weapon':
                    $character->weaponId = $id;
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

        $equiped_ids = [
            Auth::user()->character->headId,
            Auth::user()->character->bodyId,
            Auth::user()->character->legsId,
            Auth::user()->character->weaponId,
        ];

        return $this->userStash();
    }

    public function userSell(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }

        $id = $request->header('id');

        $character = Auth::user()->character;
        $unequip = filter_var(
            $request->header('unequip'),
            FILTER_VALIDATE_BOOLEAN
        );

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

        $character->gold += $item->price;
        $character->totalGold = $character->totalGold + $item->price;

        $character->save();
        $item->delete();

        return $this->userStash();
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

            $key_ability_index = $this->keyStat($template['key_ability']);

            for ($p = 0; $p < $level - 1; $p++) {
                switch (rand(0, 6)) {
                        //Random statokat rollolunk. 14% mindennek kivéve a key-nek annak 14%*3 a chance, hogy kap
                    case 0:
                        $stats[0] += 1; //str
                        break;
                    case 1:
                        $stats[1] += 1; //dex
                        break;
                    case 2:
                        $stats[2] += 1; //mag
                        break;
                    case 3:
                        $stats[3] += 1; //vit
                        break;
                    case 4:
                        $stats[4] += 1; //speed
                        break;
                    default:
                        $stats[$key_ability_index] += 1;
                        break;
                }
            }


            $health = 200;
            $bonus = 10;
            /*Hp scaling calculation*/
            //10 hp bonus per level
            //Increases by 1.5 every 10 levels
            for ($h = 1; $h < $level; $h++) {
                if ($h % 10 == 0) {
                    $bonus = round($bonus * 1.5);
                }
                $health = $health + $bonus;
            }

            $monsters[] = (object) [
                'name' => $template['name'],
                'key_ability_index' => $key_ability_index,
                'level' => $level,

                'strength' => $stats[0],
                'dexterity' => $stats[1],
                'magic' => $stats[2],
                'vitality' => $stats[3],
                'speed' => $stats[4],

                'damage' => floor(floor($level) + 3 * (1.4 * $stats[$key_ability_index])),
                //Warning: Enemynek elég akkor csak majd a damage variance, hogy meglegyen a végső damage

                'file_path' => $template['file_path'],
                'hp' => $health,
            ];
        }

        //return view('Combat', ['monsters' => $monsters]);


        return response()->json(['monsters' => $monsters], 200);
    }

    public function userCombatGen(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); //Ha nincs belépve és kell auth_required akkor redirect
        }
        $monster = json_decode($request->header('monsterData'), true);
        //Szörnynek minden fontos adata


        /*Karakter adatainak összeszedése */
        $character = Auth::user()->character;

        /*Armor és weapon piecek lekérdezése a stashből*/
        $head = Stash::find($character->headId);
        $body = Stash::find($character->bodyId);
        $legs = Stash::find($character->legsId);
        $weapon = Stash::find($character->weaponId);

        /*Player armor ratingje*/
        $player_armor =
            ($character->headId != null ? $head->armor : 0) +
            ($character->bodyId != null ? $body->armor : 0) +
            ($character->legsId != null ? $legs->armor : 0);

        /*Csak ezek a statok kapnak bonusokat, de lehetne a többinek is*/
        $player_stats = [
            $character->strength +
                ($character->headId != null ? $head->bonus_s : 0)  +
                ($character->bodyId != null ? $body->bonus_s : 0) +
                ($character->legsId != null ? $legs->bonus_s : 0),
            $character->dexterity +
                ($character->headId != null ? $head->bonus_d : 0)  +
                ($character->bodyId != null ? $body->bonus_d : 0)  +
                ($character->legsId != null ? $legs->bonus_d : 0),
            $character->magic +
                ($character->headId != null ? $head->bonus_m : 0)  +
                ($character->bodyId != null ? $body->bonus_m : 0)  +
                ($character->legsId != null ? $legs->bonus_m : 0),
            $character->vitality,
            $character->speed,
        ];
        $player_key_ability_index = $this->keyStat($weapon ? $weapon->type->key_ability : null);

        $monster['maxHp'] = $monster['hp'];
        $player = array(
            'name' => $character->name,
            'level' => $character->level,
            'key_ability_index' => $player_key_ability_index,

            'strength' => $player_stats[0],
            'dexterity' => $player_stats[1],
            'magic' => $player_stats[2],
            'vitality' => $player_stats[3],
            'speed' => $player_stats[4],

            'damage' => floor(($weapon ? $weapon->damage : 1) * (1.4 * $player_stats[$player_key_ability_index])),
            'armor' => $player_armor,

            'hp' => $character->maxHealth,
            'maxHp' => $character->maxHealth,
        );
        $turn = 1;
        $won = '';

        $calcHpPlayer = $character->maxHealth;
        $calcHpMonster = $monster['maxHp'];

        while ($calcHpPlayer > 0 && $calcHpMonster > 0) {
            if ($player['speed'] >= $monster['speed']) {
                $results[$turn]['player'] = $this->attack($player, $monster, 1);
                $results[$turn]['turn_order'] = 'player';

                $calcHpMonster = $calcHpMonster - $results[$turn]['player']['damage'];
                if ($calcHpMonster <= 0) {
                    $results['won'] = 'player';
                    break;
                }

                $results[$turn]['monster'] = $this->attack($monster, $player, (1 - (($player['armor'] / 4) / 100))); //80 armornál van 20% dr

                $calcHpPlayer = $calcHpPlayer - $results[$turn]['monster']['damage'];
                if ($calcHpPlayer <= 0) {
                    $results['won'] = 'monster';
                    break;
                }
                $turn += 1;
            } else {
                $results[$turn]['monster'] = $this->attack($monster, $player, (1 - (($player['armor'] / 4) / 100)));
                $results[$turn]['turn_order'] = 'monster';

                $calcHpPlayer = $calcHpPlayer - $results[$turn]['monster']['damage'];
                if ($calcHpPlayer <= 0) {
                    $results['won'] = 'monster';
                    break;
                }

                $results[$turn]['player'] = $this->attack($player, $monster, 1);

                $calcHpMonster = $calcHpMonster - $results[$turn]['player']['damage'];
                if ($calcHpMonster <= 0) {
                    $results['won'] = 'player';
                    break;
                }
                $turn += 1;
            }
        }

        $results['player_data'] = $player;
        $results['monster_data'] = $monster;
        $results['turn_count'] = $turn;
        if ($results['won'] == 'player') {
            $results['gold'] = $monster['level'] * 10;
            $results['exp'] = rand($player['level'] * 10 * ceil($player['level'] / 10), round($player['level'] * 10 * ceil($player['level'] / 10) * 1.2));


            $character->gold = $character->gold + $results['gold'];
            $character->totalGold = $character->totalGold + $results['gold'];
            $character->totalBattles = $character->totalBattles + 1;
            $character->totalBattlesWon = $character->totalBattlesWon + 1;

            if ($character->exp >= $this->expCapCalc($character->level)) {
                $character->level = $character->level + 1;
            }

            $character->exp = $character->exp + $results['exp'];
            $character->save();
        } else {
            $results['gold'] = 0;
            $results['exp'] = 0;


            $character->totalBattles = $character->totalBattles + 1;
            $character->save();
        }


        return response()->json(['combat_data' => $results], 200);
    }
    public function attack($attacker, $attacked, $damageReduction)
    {
        $toHit_attacked = rand(0, 100);
        $toHit_attacker = rand(0, 100);

        switch (true) {
            case ($toHit_attacker > "98"): //CRIT! 2% chance
                return
                    array(
                        'damage' => round(rand($attacker['damage'] * 0.8, $attacker['damage'] * 1.2) * $damageReduction) * 2,
                        'crit' => true,
                        'miss' => false,
                    );
            case ($toHit_attacker  >= $toHit_attacked): //regular hit 
                return
                    array(
                        'damage' => round(rand($attacker['damage'] * 0.8, $attacker['damage'] * 1.2) * $damageReduction),
                        'crit' => false,
                        'miss' => false,
                    );
            case ($toHit_attacker == 0): //Critical Failure!
                return
                    array(
                        'damage' => 0,
                        'crit' => true,
                        'miss' => true,
                    );
            default: //miss
                return
                    array(
                        'damage' => 0,
                        'crit' => false,
                        'miss' => true,
                    );
        }
        return 0;
    }
    public function keyStat($k_a)
    {
        switch ($k_a) {
            case 'strength':
                return 0;
                break;
            case 'dexterity':
                return 1;
                break;
            case 'magic':
                return 2;
                break;
            default:
                return 0; //Ha nincs fegyvered akkor ökölel ütsz és az strengthből scalel
                break;
        }
    }

    public function hpCalc($level, $vitality)
    {
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
        for ($v = 0; $v < $vitality; $v++) {
            $vit_health = $vit_health + $vit_bonus;
            if ($v < 40) {
                $vit_bonus = round($vit_bonus * 1.02);
            } else {
                $vit_bonus = round($vit_bonus * 0.9);
            }
        }

        return ($maxHealth + $vit_health);
    }

    public function expCapCalc($level)
    {
        $previous_level = 0;
        $next_level = 0;
        $level_gap = 250;
        for ($e = 1; $e < $level; $e++) {
            $previous_level = $next_level;

            if ($e % 10 == 0) {
                $level_gap = $level_gap + round(300 * 1.5 ^ floor($level / 10));
            }
            $next_level = $next_level + $level_gap;
        }
        return $next_level;
    }
}
