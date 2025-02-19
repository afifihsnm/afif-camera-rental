<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\EditRecordAndRedirectToIndex;
use App\Filament\Resources\UserResource;
use Filament\Actions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EditUser extends EditRecordAndRedirectToIndex
{
    protected static string $resource = UserResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
		return DB::transaction(function () use ($record, $data) {
		$data['role'] !== null && $record->syncRoles([$data['role']]);
		$record->update($data);

		return $record;
        });
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
