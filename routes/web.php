<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/history', [RentController::class, 'history'])->name('rent.history');
	Route::get('/cart', [CartController::class, 'view'])->name('cart');
	Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
	Route::delete('/cart/{id}', [CartController::class, 'delete'])->name('cart.delete');
	Route::post('/rents', [RentController::class, 'store'])->name('rents.store');
});

Route::get('/search', [ProductController::class, 'search'])->name('product.list');
Route::get('/product/{slug}', [ProductController::class, 'detail'])->name('product.detail');

require __DIR__.'/auth.php';
