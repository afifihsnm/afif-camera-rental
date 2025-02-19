<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RentController extends Controller
{
	public function history()
	{
		return Inertia::render('Rent/History');
	}
}
