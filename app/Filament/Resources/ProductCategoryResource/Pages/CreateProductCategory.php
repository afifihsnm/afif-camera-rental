<?php

namespace App\Filament\Resources\ProductCategoryResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\ProductCategoryResource;

class CreateProductCategory extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = ProductCategoryResource::class;
}
