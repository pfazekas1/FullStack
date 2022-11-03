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

Route::get('/', function () {
    return view('home');
});

Route::get('/testing', function () {
    return view('test');
});

Route::middleware(['auth'])->group(function () {

    Route::get('/store', [UserController::class, 'userStore'])->name(
        'user.store'
    );
    Route::post('/store', [UserController::class, 'userBought'])->name(
        'user.store'
    );

    Route::get('/character', [UserController::class, 'userSheet'])->name(
        'user.sheet'
    );

    Route::put('/character', [UserController::class, 'userUpgrade'])->name(
        'user.upgrade'
    ); //ez csak azért, put, mert különben nem látja

    Route::patch('/character', [UserController::class, 'userRespec'])->name(
        'user.respec'
    );

    Route::get('/stash', [UserController::class, 'userStash'])->name(
        'user.stash'
    );
    Route::patch('/stash', [UserController::class, 'userEquip'])->name(
        'user.equip'
    );
    Route::delete('/stash', [UserController::class, 'userSell'])->name(
        'user.sell'
    );

    Route::get('/combat', [UserController::class, 'userMonsterGen'])->name(
        'user.combat'
    );
    Route::patch('/combat', [UserController::class, 'userCombatGen'])->name(
        'user.combatBegin'
    );
});

require __DIR__ . '/auth.php';

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
