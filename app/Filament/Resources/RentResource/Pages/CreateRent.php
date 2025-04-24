<?php

namespace App\Filament\Resources\RentResource\Pages;

use App\Filament\CreateRecordAndRedirectToIndex;
use App\Filament\Resources\RentResource;
use App\Models\Product;
use Filament\Notifications\Notification;

class CreateRent extends CreateRecordAndRedirectToIndex
{
    protected static string $resource = RentResource::class;

    protected function beforeCreate(): void
    {
        if ($this->data['status'] == 1 || $this->data['status'] == 2) {
            try {
                foreach ($this->data['rentDetails'] as $detail) {
                    if (empty($detail['product_id']) || empty($detail['qty'])) {
                        continue;
                    }

                    $product = Product::find($detail['product_id']);
                    if (!$product || $product->stock < $detail['qty']) {
                        throw new \Exception("Insufficient stock for product: {$product->title}");
                    }
                }
            } catch (\Exception $e) {
                Notification::make()
                    ->title('Stock Error')
                    ->body($e->getMessage())
                    ->danger()
                    ->send();

                $this->halt();
            }
        } elseif ($this->data['status'] == 0) {
            $lowStockProducts = [];

            foreach ($this->data['rentDetails'] as $detail) {
                if (empty($detail['product_id']) || empty($detail['qty'])) {
                    continue;
                }

                $product = Product::find($detail['product_id']);
                if ($product && $product->stock < $detail['qty']) {
                    $lowStockProducts[] = [
                        'name' => $product->title,
                        'requested' => $detail['qty'],
                        'available' => $product->stock
                    ];
                }
            }

            if (!empty($lowStockProducts)) {
                $warningMessage = "Low stock warning:\n";
                foreach ($lowStockProducts as $product) {
                    $warningMessage .= "- {$product['name']}: Requested {$product['requested']}, only {$product['available']} available\n";
                }

                Notification::make()
                    ->title('Low Stock Warning')
                    ->body($warningMessage)
                    ->warning()
                    ->persistent()
                    ->send();
            }
        }
    }

    protected function afterCreate(): void
    {
        // If created with Rented status, decrease stock after creation
        if ($this->record->status == 2) {
            try {
                $this->record->decreaseStock();
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
