<?php

namespace App\Filament\Resources\ProductBrandResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\ProductBrandResource;

class CreateProductBrand extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = ProductBrandResource::class;
}
