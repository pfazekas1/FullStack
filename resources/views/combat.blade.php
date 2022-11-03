@extends('layouts.app') @section('title', 'Sheet')
@section('content')

    @isset($monsters)
        <table>
            <tr>
                <th>Name</th>
                <th>Level</th>
            </tr>
            @foreach ($monsters as $monster)
                <tr>
                    <td>{{ str_replace('_', ' ', $monster->name) }}</td>

                    <td>{{ $monster->level }}</td>

                    <td>
                        <form method="POST" action="{{ route('user.combatBegin') }}" enctype="multipart/form-data">
                            @csrf
                            @method('PATCH')
                            <input type="hidden" name="monsterData" value={{ json_encode($monster) }}>
                            <button type="submit">Fight!</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </table>
    @endisset

    @isset($results)
        <table>
            <tr>
                <th>Turn</th>
                <th>Player_hp</th>
                <th>Monster_hp</th>
            </tr>
            @for ($i = 1; $i < count($results) - 1; $i++)
                <tr>
                    <td>{{ $i }}</td>
                    <td>{{ $results[$i]['player_hp'] }}</td>
                    <td>{{ $results[$i]['monster_hp'] }}</td>
                </tr>
            @endfor
            <h3>{{ $results['won'] }} won</h3>

        </table>
    @endisset

@endsection
