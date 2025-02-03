<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rent_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rent_id')->constrained(table: 'rents', indexName: 'rent_details_rent_id')->onDelete('cascade');
            $table->foreignId('product_id')->constrained(table: 'products', indexName: 'rent_details_product_id')->onDelete('cascade');
            $table->unsignedSmallInteger('qty');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_details');
    }
};
