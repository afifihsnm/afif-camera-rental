<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\EditRecordAndRedirectToIndex;
use App\Filament\Resources\UserResource;
use Filament\Actions;
use Illuminate\Database\Eloquent\Model;

class EditUser extends EditRecordAndRedirectToIndex
{
    protected static string $resource = UserResource::class;

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $data['role'] !== null && $record->syncRoles([$data['role']]);
        $record->update($data);

        return $record;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
