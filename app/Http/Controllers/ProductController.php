<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
	public function search()
	{
		$categories = DB::table('product_categories')->get();
		$brands = DB::table('product_brands')->get();
		$allProducts = DB::table('products as p')
			->join('product_categories as pc', 'p.product_category_id', '=', 'pc.id')
			->join('product_brands as pb', 'p.product_brand_id', '=', 'pb.id')
			->select(
				'p.id',
				'p.title',
				DB::raw("json_extract(p.images, '$[0]') as image"),
				'p.rate_24h as price',
				'p.stock',
				'p.slug',
				'pc.name as category',
				'pb.name as brand'
			)
			->get();

		return Inertia::render('Product/Search', [
			'categories' => $categories,
			'brands' => $brands,
			'allProducts' => $allProducts
		]);
	}

	public function detail(string $slug)
	{
		$detail = DB::table('products as p')
			->join('product_categories as pc', 'p.product_category_id', '=', 'pc.id')
			->join('product_brands as pb', 'p.product_brand_id', '=', 'pb.id')
			->select(
				'p.id',
				'p.title',
				'p.description',
				// 'p.images',
				DB::raw("json_extract(p.images, '$') as images"),
				'p.rate_12h',
				'p.rate_24h',
				'p.late_fee',
				'p.stock',
				'pc.name as category',
				'pb.name as brand'
			)
			->where('p.slug', $slug)
			->first();
		$detail->images = json_decode($detail->images, true);

		return Inertia::render('Product/Detail', [
			'detail' => $detail,
		]);
	}
}
