<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\UserResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CreateUser extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = UserResource::class;

    protected function handleRecordCreation(array $data): Model
    {
		    return DB::transaction(function () use ($data) {
            $result = static::getModel()::create($data);
            $result->assignRole($data['role']);
            
            DB::table('carts')->insert([
                'user_id' => $result->id,
            ]);

            return $result;
        });
    }
}
