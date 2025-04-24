<?php

namespace App\Filament;

use Filament\Resources\Pages\CreateRecord;

class CreateRecordAndRedirectToIndex extends CreateRecord
{
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
