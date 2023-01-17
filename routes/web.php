<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/testing', function () {
    return view('test');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return view('home');
    });
    Route::get('/api/csrf', [UserController::class, 'authCsrf'])->name(
        'user.csrf'
    );

    Route::get('/character', function () {
        return view('home');
    });


    /*TODO: Föntiek átrendezése */


    Route::get('/stash', function () {
        return view('home');
    });
    Route::get('/store', function () {
        return view('home');
    });
    Route::get('/combat', function () {
        return view('home');
    });

    Route::get('/sheet', function () {
        return view('home');
    });
    Route::get('/api/stash', [UserController::class, 'userStash'])->name(
        'user.stash'
    );
    Route::patch('/api/stash', [UserController::class, 'userEquip'])->name(
        'user.equip'
    );
    Route::delete('/api/stash', [UserController::class, 'userSell'])->name(
        'user.sell'
    );
    Route::get('/api/store', [UserController::class, 'userStore'])->name(
        'user.store'
    );
    Route::patch('/api/store', [UserController::class, 'userBought'])->name(
        'user.bought'
    );

    Route::put('/api/sheet', [UserController::class, 'userUpgrade'])->name(
        'user.upgrade'
    );
    Route::patch('/api/sheet', [UserController::class, 'userRespec'])->name(
        'user.respec'
    );
    Route::get('/api/combat', [UserController::class, 'userMonsterGen'])->name(
        'user.combat'
    );
    Route::patch('/api/combat', [UserController::class, 'userCombatGen'])->name(
        'user.combatBegin'
    );
});

require __DIR__ . '/auth.php';
