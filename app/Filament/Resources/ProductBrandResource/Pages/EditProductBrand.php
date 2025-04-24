<?php

namespace App\Filament\Resources\ProductBrandResource\Pages;

use App\Filament\EditRecordAndRedirectToIndex;
use App\Filament\Resources\ProductBrandResource;
use Filament\Actions;

class EditProductBrand extends EditRecordAndRedirectToIndex
{
    protected static string $resource = ProductBrandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
