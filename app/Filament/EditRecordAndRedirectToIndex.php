<?php

namespace App\Filament;

use Filament\Resources\Pages\EditRecord;

class EditRecordAndRedirectToIndex extends EditRecord
{
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
