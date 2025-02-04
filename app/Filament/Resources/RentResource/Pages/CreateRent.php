<?php

namespace App\Filament\Resources\RentResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\RentResource;

class CreateRent extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = RentResource::class;
}
