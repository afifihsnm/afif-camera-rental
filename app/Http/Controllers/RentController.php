<?php

namespace App\Http\Controllers;

use App\Services\RentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RentController extends Controller
{
	protected $pricingService;

    public function __construct(RentService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

	// Store Rent Order from Cart
	public function store(Request $request)
	{
		$validated = $request->validate([
			'start_date' => 'required|date',
			'end_date' => 'required|date|after:start_date',
			'cart_items' => 'required|array',
			'cart_items.*.id' => 'required|exists:products,id',
			'cart_items.*.qty' => 'required|integer|min:1',
		]);

		// Calculate prices using the service
        $prices = $this->pricingService->calculatePrice(
            $validated['start_date'],
            $validated['end_date'],
            $validated['cart_items']
        );

		try {
			DB::beginTransaction();

			$userId = Auth::id();

			// Create the rent record
			$rentId = DB::table('rents')->insertGetId([
				'user_id' => $userId,
				'start_date' => $validated['start_date'],
				'end_date' => $validated['end_date'],
				'subtotal' => $prices['subtotal'],
				'total' => $prices['total'],
				'created_at' => now(),
				'updated_at' => now(),
			]);

			// Create rent details for each cart item
			foreach ($validated['cart_items'] as $item) {
				DB::table('rent_details')->insert([
					'rent_id' => $rentId,
					'product_id' => $item['id'],
					'qty' => $item['qty'],
					'created_at' => now(),
					'updated_at' => now(),
				]);
			}

			// Clear the user's cart
			DB::table('cart_items')
				->whereIn('cart_id', function ($query) use ($userId) {
					$query->select('id')
						->from('carts')
						->where('user_id', $userId);
				})
				->delete();

			DB::commit();
			return to_route('rent.history');
		} catch (\Exception $e) {
			dd($e->getMessage());
		}
	}

	public function cancel($id)
	{
		$rent = DB::table('rents')
        ->where('id', $id)
        ->where('user_id', Auth::id())
        ->whereIn('status', [0, 1]) // Only allow cancellation for Pending or Confirmed
        ->first();

		if (!$rent) {
			return back()->with('error', 'Rent not found or cannot be cancelled');
		}

		DB::table('rents')
        ->where('id', $id)
        ->update(['status' => 5]); // 5 = Cancelled

    	return redirect()->back()->with('success', 'Rent has been cancelled');
	}

	public function history()
	{
        $userId = Auth::id();

        // Fetch all rentals for the authenticated user.
        $rentals = DB::table('rents')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Extract rental IDs to fetch related products.
        $rentalIds = $rentals->pluck('id')->all();

        // Fetch associated products for these rentals.
        $rentDetails = DB::table('rent_details')
            ->join('products', 'rent_details.product_id', '=', 'products.id')
            ->select(
                'rent_details.rent_id',
                'products.id',
                'products.title as name',
                'products.images', // JSON field containing images
                'products.rate_24h as rate24Hour',
                'products.rate_12h as rate12Hour',
                'rent_details.qty as quantity'
            )
            ->whereIn('rent_details.rent_id', $rentalIds)
            ->get();
		// dd($rentDetails);

        // Group the product details by rental order.
        $rentDetailsGrouped = $rentDetails->groupBy('rent_id');

        // Transform each rental record to include its products.
        $data = $rentals->map(function($rental) use ($rentDetailsGrouped) {
            // Retrieve associated products or an empty collection.
            $products = collect($rentDetailsGrouped->get($rental->id, []))
                ->map(function($product) {
                    // Decode the JSON images field to extract the primary image.
                    $images = json_decode($product->images, true);
                    $product->image = $images[0] ?? '';
                    unset($product->images); // Optionally remove the raw images field.
                    return $product;
                })
                ->values();

            return [
                'id'            => $rental->id,
                'startDate'     => $rental->start_date,
                'endDate'       => $rental->end_date,
                'returnedDate'  => $rental->returned_date,
                'status'        => $rental->status,
                'subtotal'      => $rental->subtotal,
                'total'         => $rental->total,
                'products'      => $products,
            ];
        });

        return Inertia::render('Rent/History', ['rentals' => $data]);
	}
}
