@extends('layouts.layout') @section('title', 'Inventory')
@section('content')
    <table>
        <tr>
            <th>Name</th>
            <th>Item type</th>
            <th>Rarity</th>
            <th>Damage/Armor</th>
            <th>Attributes</th>
        </tr>
        @foreach ($stash as $item)
            <tr>
                <td>{{ $item->name }}</td>
                <td>{{ $types[$item->type_id - 1]->name }}</td>
                <td>{{ $item->rarity }}</td>
                <td>{{ $item->damage != 0 ? $item->damage : $item->armor }}</td>
                <td>Strength:{{ $item->Bonus_S - $item->Negative_S }} Dexterity:{{ $item->Bonus_D - $item->Negative_D }}
                    Magic:{{ $item->Bonus_M - $item->Negative_M }}</td>
            </tr>
        @endforeach
    </table>
@endsection
