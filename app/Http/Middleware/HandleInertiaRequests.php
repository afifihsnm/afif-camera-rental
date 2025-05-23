<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
			'appUrl' => config('app.url'),
            'auth' => [
                'user' => $request->user(),
				'roles' => fn () => $request->user() ? $request->user()->getRoleNames()->toArray() : [],
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
			'cartCount' => function () use ($request) {
                if (!$request->user()) return 0;

                return DB::table('cart_items')
                    ->join('carts', 'carts.id', '=', 'cart_items.cart_id')
                    ->where('carts.user_id', $request->user()->id)
                    ->count();
            },
            'rentCount' => function () use ($request) {
                if (!$request->user()) return 0;

                return DB::table('rents')
                    ->where('user_id', $request->user()->id)
                    ->count();
            },
        ];
    }
}
