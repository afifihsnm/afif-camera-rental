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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_category_id')->constrained(table: 'product_categories', indexName: 'products_product_category_id')->onDelete('set null');
            $table->foreignId('product_brand_id')->constrained(table: 'product_brands', indexName: 'products_product_brand_id')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('images');
            $table->unsignedMediumInteger('rate_12h')->nullable();
            $table->unsignedMediumInteger('rate_24h');
            $table->unsignedMediumInteger('late_fee');
            $table->unsignedSmallInteger('stock');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
