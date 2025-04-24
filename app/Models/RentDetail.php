<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentDetail extends Model
{
    protected $guarded = [];

    public function rent(): BelongsTo
    {
        return $this->belongsTo(Rent::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
