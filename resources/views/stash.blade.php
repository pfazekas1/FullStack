@extends('layouts.app') @section('title', 'Inventory')
@section('content')
    <table>
        <tr>
            <th>Name</th>
            <th>Item type</th>
            <th>Rarity</th>
            <th>Damage/Armor</th>
            <th>Attributes</th>
            <th>Price</th>
        </tr>
        @foreach ($stash as $item)
            @if ($item->store_item == false)
                <tr>
                    <td>{{ $item->name }}</td>
                    <td>{{ $types[$item->type_id - 1]->name }}</td>
                    <td>{{ $item->rarity }}</td>
                    <td>{{ $item->damage != 0 ? $item->damage : $item->armor }}</td>
                    <td>Strength:{{ $item->bonus_s - $item->negative_s }} Dexterity:{{ $item->bonus_d - $item->negative_d }}
                        Magic:{{ $item->bonus_m - $item->negative_m }}</td>
                    <td>{{ $item->price }} G</td>
                    <td>
                        <form method="post" action="{{ route('user.stash') }}" enctype="multipart/form-data">
                            @csrf
                            @method('PATCH')
                            <input type="hidden" name="placementType" id="placementType"
                                value={{ $types[$item->type_id - 1]->placementType }}>
                            <input type="hidden" name="unequip" id="unequip"
                                value={{ in_array($item->id, $equiped_ids) ? 'true' : 'false' }}>
                            <button type="submit" name="id" id="id"
                                value={{ $item->id }}>{{ in_array($item->id, $equiped_ids) ? 'Unequip' : 'Equip' }}</button>
                        </form>
                    </td>
                    <td>
                        <form method="post" action="{{ route('user.stash') }}" enctype="multipart/form-data">
                            @csrf
                            @method('DELETE')
                            <input type="hidden" name="unequip" id="unequip"
                                value={{ in_array($item->id, $equiped_ids) ? 'true' : 'false' }}>
                            <button type="submit" name="id" id="id" value={{ $item->id }}>Sell</button>
                        </form>
                    </td>
                </tr>
            @endif
        @endforeach
    </table>
@endsection
