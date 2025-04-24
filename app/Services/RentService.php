<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RentService
{
	/**
	 * Calculate rental prices including subtotal and total with late fees
	 *
	 * @param string|Carbon|null $startDate
	 * @param string|Carbon|null $endDate
	 * @param Collection|array $items Array of items with product_id and qty
	 * @param string|Carbon|null $returnedDate Optional returned date for late fee calculation
	 * @return array Returns ['subtotal' => float, 'total' => float]
	 */
	public function calculatePrice(
		string|Carbon|null $startDate,
		string|Carbon|null $endDate,
		Collection|array $items,
		string|Carbon|null $returnedDate = null
	): array {
		// Early return if dates are null
		if ($startDate === null || $endDate === null) {
            return ['subtotal' => 0, 'total' => 0];
        }

		try {
			// Convert dates to Carbon instances
			$startDate = $startDate instanceof Carbon ? $startDate : Carbon::parse($startDate);
			$endDate = $endDate instanceof Carbon ? $endDate : Carbon::parse($endDate);
			$returnedDate = $returnedDate ? (is_string($returnedDate) ? Carbon::parse($returnedDate) : $returnedDate) : null;
		} catch (\Exception $e) {
			return ['subtotal' => 0, 'total' => 0];
		}

		// Validate dates
		if (!$startDate || !$endDate || $endDate < $startDate) {
			return ['subtotal' => 0, 'total' => 0];
		}

		// Convert items to collection if array
		$items = is_array($items) ? collect($items) : $items;

		// Filter valid items and get product IDs
		$selectedProducts = $items->filter(function ($item) {
			$productId = $item['product_id'] ?? ($item['id'] ?? null);
			$qty = $item['qty'] ?? null;

			return !empty($productId) && !empty($qty);
		});

		if ($selectedProducts->isEmpty()) {
            return ['subtotal' => 0, 'total' => 0];
        }

		// Get product prices from database
        $productIds = $selectedProducts->map(function ($item) {
            return $item['product_id'] ?? $item['id'];
        });

		$prices = DB::table('products')
			->whereIn('id', $productIds)
			->get(['id', 'rate_24h', 'rate_12h', 'late_fee'])
			->keyBy('id');

		// Calculate rental duration with minimum 12h enforcement
		$rentalDurationHours = max($startDate->diffInHours($endDate), 12);

		// Calculate subtotal
		$subtotal = $this->calculateSubtotal($selectedProducts, $prices, $rentalDurationHours);

		// Calculate late fee if applicable
		$lateFee = $this->calculateLateFee($returnedDate, $endDate, $selectedProducts, $prices);

		return [
			'subtotal' => $subtotal,
			'total' => $subtotal + $lateFee
		];
	}

	private function calculateSubtotal(Collection $products, Collection $prices, int $rentalDurationHours): float
	{
		return $products->reduce(function ($subtotal, $product) use ($prices, $rentalDurationHours) {
			$productId = $product['product_id'] ?? $product['id'];
			$productPrice = $prices[$productId] ?? null;
			if (!$productPrice) return $subtotal;

			// Handle 24-hour only products
			if ($productPrice->rate_12h === null) {
				$minimumHours = max($rentalDurationHours, 24);
				$fullDays = ceil($minimumHours / 24);
				return $subtotal + ($productPrice->rate_24h * $fullDays * $product['qty']);
			}

			// Handle 12-hour rate products
			$totalBlocks = ceil($rentalDurationHours / 12);
			$fullDays = intdiv($totalBlocks, 2);
			$remainingBlocks = $totalBlocks % 2;

			return $subtotal +
				($productPrice->rate_24h * $fullDays +
					$productPrice->rate_12h * $remainingBlocks) * $product['qty'];
		}, 0);
	}

	private function calculateLateFee(?Carbon $returnedDate, Carbon $endDate, Collection $products, Collection $prices): float
	{
		if (!$returnedDate || !$returnedDate->gt($endDate)) {
			return 0;
		}

		$totalLateMinutes = $endDate->diffInMinutes($returnedDate);
		$lateHours = ceil($totalLateMinutes / 60); // Round up to nearest hour

		return $products->sum(function ($product) use ($prices, $lateHours) {
			$productId = $product['product_id'] ?? $product['id'];
			$productPrice = $prices[$productId] ?? null;
			return $productPrice ? $lateHours * $product['qty'] * $productPrice->late_fee : 0;
		});
	}
}
