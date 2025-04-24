<?php

namespace App\Filament\Resources\RentResource\Pages;

use App\Filament\EditRecordAndRedirectToIndex;
use App\Filament\Resources\RentResource;
use Filament\Actions;

class EditRent extends EditRecordAndRedirectToIndex
{
    protected static string $resource = RentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
