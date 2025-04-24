<?php

namespace App\Filament\Resources\ProductCategoryResource\Pages;

use App\Filament\EditRecordAndRedirectToIndex;
use App\Filament\Resources\ProductCategoryResource;
use Filament\Actions;

class EditProductCategory extends EditRecordAndRedirectToIndex
{
    protected static string $resource = ProductCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
