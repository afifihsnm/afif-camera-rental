<?php

namespace App\Filament\Resources\RentResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\RentResource;
use Filament\Notifications\Notification;

class CreateRent extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = RentResource::class;

    protected function afterCreate(): void
    {
        // If created with Rented status, decrease stock after creation
        if ($this->record->status == 2) {
            try {
                $rentDetails = $this->record->rentDetails;

                // Validate stock before creation
                foreach ($rentDetails as $detail) {
                    $product = \App\Models\Product::find($detail->product_id);
                    if (!$product || $product->stock < $detail['qty']) {
                        throw new \Exception("Insufficient stock for product: {$product->title}");
                    }

                    // Decrease stock here
                    $product->decrement('stock', $detail->qty);
                }
            } catch (\Exception $e) {
                Notification::make()
                    ->title('Stock Error')
                    ->body($e->getMessage())
                    ->danger()
                    ->send();
            }
        }
    }
}
