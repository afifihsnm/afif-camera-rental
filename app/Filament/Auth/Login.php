<?php

namespace App\Filament\Auth;

use Filament\Pages\Auth\Login as BaseAuth;

class Login extends BaseAuth
{
    public function mount(): void
	{
		parent::mount();

		$this->form->fill([
			'email' => 'test@admin.com',
			'password' => 'admin1234',
			'remember' => true,
		]);
	}
}