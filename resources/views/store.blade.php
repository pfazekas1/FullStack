@extends('layouts.app') @section('title', 'Inventory')
@section('content')
    <table>
        <tr>
            <th>Name</th>
            <th>Item type</th>
            <th>Rarity</th>
            <th>Damage/Armor</th>
            <th>Attributes</th>
        </tr>
        {{ $character->gold }} Goldom
        Frissitési idő: {{ $oldTimer == null ? $character->store_timer : $oldTimer }}
        Új idő: {{ $newTimer }}
        @foreach ($store as $item)
            <tr style={{ $character->gold < $item->price ? 'background-color:red' : '' }}>
                <td>{{ $item->name }}</td>
                <td>{{ $types[$item->type_id - 1]->name }}</td>
                <td>{{ $item->rarity }}</td>
                <td>{{ $item->damage != 0 ? $item->damage : $item->armor }}</td>
                <td>Strength:{{ $item->bonus_s - $item->negative_s }} Dexterity:{{ $item->bonus_d - $item->negative_d }}
                    Magic:{{ $item->bonus_m - $item->negative_m }}</td>
                <td>{{ $item->price }}G</td>
                <td>
                    <form method="post" action="{{ route('user.store') }}" enctype="multipart/form-data">
                        <!--Csak ide kell tenni a régit adatokat, hogy majd tovább adja-->
                        @csrf
                        <button type="submit" name="id" id="id" value={{ $item->id }}
                            {{ $character->gold < $item->price ? 'disabled' : '' }}>BUY</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>
@endsection
