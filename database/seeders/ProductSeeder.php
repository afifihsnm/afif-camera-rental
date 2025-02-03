<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
	use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_categories')->insert([
            [
                'name' => 'Kamera'
            ],
            [
                'name' => 'Lensa'
            ],
            [
                'name' => 'Aksesoris'
            ],
        ]);

        DB::table('product_brands')->insert([
            [
                'name' => 'Canon'
            ],
            [
                'name' => 'Sony'
            ],
        ]);
    }
}
