<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\ProductResource;

class CreateProduct extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = ProductResource::class;
}
