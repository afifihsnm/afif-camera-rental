<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Rent extends Model
{
    protected $guarded = [];

    protected static function booted(): void
    {
        // For updating existing rent
        static::updating(function ($rent) {
            if ($rent->isDirty('status')) {
                $oldStatus = $rent->getOriginal('status');
                $newStatus = $rent->status;

                // If changing to Rented (2)
                if ($newStatus == 2 && $oldStatus != 2) {
                    $rent->decreaseStock();
                }

                // If changing from Rented to Returned/Completed
                if (in_array($newStatus, [3, 4]) && $oldStatus == 2) {
                    $rent->increaseStock();
                }

                // If cancelling a rented order
                if ($newStatus == 5 && $oldStatus == 2) {
                    $rent->increaseStock();
                }
            }
        });

        // After rent and its details are created
        static::created(function ($rent) {
            // If created with Rented status, decrease stock after rentDetails are created
            if ($rent->status == 2) {
                // We'll handle this in the RentResource
                $rent->needs_stock_decrease = true;
            }
        });
    }

    public function decreaseStock(): void
    {
        DB::transaction(function () {
            foreach ($this->rentDetails as $detail) {
                $product = Product::find($detail->product_id);

                if (!$product || $product->stock < $detail->qty) {
                    throw new \Exception("Insufficient stock for product: {$product->title}");
                }

                $product->decrement('stock', $detail->qty);
            }
        });
    }

    public function increaseStock(): void
    {
        DB::transaction(function () {
            foreach ($this->rentDetails as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $product->increment('stock', $detail->qty);
                }
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rentDetails(): HasMany
    {
        return $this->hasMany(RentDetail::class);
    }
}
