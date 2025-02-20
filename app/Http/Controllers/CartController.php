<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function add(Request $request)
	{
		$validated = $request->validate([
			'product_id' => 'required|integer'
		]);

		$userId = Auth::id();

		$cart = DB::table('carts')
			->select('id')
			->where('user_id', $userId)
			->first();

		if ($cart === null) {
			$cartId = DB::table('carts')->insertGetId([
				'user_id' => $userId
			]);
			$cart = DB::table('carts')
				->select('id')
				->where('id', $cartId)
				->first();
		}

		$existingItem = DB::table('cart_items')
			->select('id', 'qty')
			->where('cart_id', $cart->id)
			->where('product_id', $validated['product_id'])
			->first();

		if ($existingItem) {
			DB::table('cart_items')
				->where('id', $existingItem->id)
				->update([
					'qty' => $existingItem->qty + 1,
					'updated_at' => now()
				]);
		} else {
			DB::table('cart_items')->insert([
				'cart_id' => $cart->id,
				'product_id' => $validated['product_id'],
				'qty' => 1,
				'created_at' => now(),
				'updated_at' => now()
			]);
		}

		return to_route('cart');
	}

	public function delete ($id)
	{
		$cartItem = CartItem::findOrFail($id);

        // Check if the cart item belongs to the authenticated user
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $cartItem->delete();
		
        return to_route('cart');
	}

	public function view()
	{
		$cartItems = DB::table('cart_items as ci')
			->join('products as p', 'ci.product_id', '=', 'p.id')
			->join('carts as c', 'ci.cart_id', '=', 'c.id')
			->select(
				'ci.id',
				'p.id as product_id',
				'p.title',
				DB::raw("json_extract(p.images, '$[0]') as image"),
				'p.rate_12h',
				'p.rate_24h',
				'p.late_fee',
				'ci.qty',
				'p.stock',
			)
			->where('c.user_id', Auth::id())
			->get();

		return Inertia::render('Cart/Cart', [
			'cartItemsData' => $cartItems,
		]);
	}
}
