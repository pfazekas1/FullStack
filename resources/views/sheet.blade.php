@extends('layouts.app') @section('title', 'Sheet')
@section('content')
    <div>
        <h2>{{ $character->name }} - Level {{ $character->level }}</h2>
        <h3>{{ $character->health . ' / ' . $character->maxHealth }} HP</h3>

        <h4>{{ $character->exp }}/{{ $character->exp + 1000 }} Experience</h4>

        <p>Remaining talent points: {{ $character->talent_points }}
        <form method="post" action="{{ route('user.respec') }}" enctype="multipart/form-data">
            @csrf
            @method('PATCH')
            <button type="submit" name="respec" id="respec"> Respec for {{ $character->level * 100 * 1.35 }}
                G</button>
        </form>
        </p>
        <ul>
            <li>strength:{{ $character->strength +
                ($items['head'] != null ? $items['head']->bonus_s + $items['head']->negative_s : 0) +
                ($items['body'] != null ? $items['body']->bonus_s + $items['body']->negative_s : 0) +
                ($items['legs'] != null ? $items['legs']->bonus_s + $items['legs']->negative_s : 0) +
                ($items['weapon'] != null ? $items['weapon']->bonus_s + $items['weapon']->negative_s : 0) }}
                @if ($character->talent_points > 0)
                    <form method="post" action="{{ route('user.upgrade') }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')
                        <button type="submit" name="type" id="type" value="str">+</button>
                    </form>
                @endif
            </li>
            <li>dexterity:{{ $character->dexterity +
                ($items['head'] != null ? $items['head']->bonus_d + $items['head']->negative_d : 0) +
                ($items['body'] != null ? $items['body']->bonus_d + $items['body']->negative_d : 0) +
                ($items['legs'] != null ? $items['legs']->bonus_d + $items['legs']->negative_d : 0) +
                ($items['weapon'] != null ? $items['weapon']->bonus_d + $items['weapon']->negative_d : 0) }}
                @if ($character->talent_points > 0)
                <form method="post" action="{{ route('user.upgrade') }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <button type="submit" name="type" id="type" value="dex">+</button>
                </form>
            @endif
            </li>
            <li>magic:{{ $character->magic +
                ($items['head'] != null ? $items['head']->bonus_m + $items['head']->negative_m : 0) +
                ($items['body'] != null ? $items['body']->bonus_m + $items['body']->negative_m : 0) +
                ($items['legs'] != null ? $items['legs']->bonus_m + $items['legs']->negative_m : 0) +
                ($items['weapon'] != null ? $items['weapon']->bonus_m + $items['weapon']->negative_m : 0) }}
                @if ($character->talent_points > 0)
                <form method="post" action="{{ route('user.upgrade') }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <button type="submit" name="type" id="type" value="mag">+</button>
                </form>
            @endif
            </li>
            <li>vitality:{{ $character->vitality }}
                @if ($character->talent_points > 0)
                    <form method="post" action="{{ route('user.upgrade') }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')
                        <button type="submit" name="type" id="type" value="vit">+</button>
                    </form>
                @endif
            </li>
            <li>speed:{{ $character->speed }}
                @if ($character->talent_points > 0)
                <form method="post" action="{{ route('user.upgrade') }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <button type="submit" name="type" id="type" value="spe">+</button>
                </form>
            @endif
            </li>
        </ul>

        <ul>
            <li>
                Head:{{ $items['head'] != null ? $items['head']->name . ' ' . $types[$items['head']->type_id - 1]->name : 'None' }}
            </li>
            <li>Body:{{ $items['body'] != null ? $items['body']->name . ' ' . $types[$items['body']->type_id - 1]->name : 'None' }}
            </li>
            <li>Legs:{{ $items['legs'] != null ? $items['legs']->name . ' ' . $types[$items['legs']->type_id - 1]->name : 'None' }}
            </li>
            <li>Weapon:{{ $items['weapon'] != null ? $items['weapon']->name . ' ' . $types[$items['weapon']->type_id - 1]->name : 'None' }}
            </li>
        </ul>


    </div>
@endsection
