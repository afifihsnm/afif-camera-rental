<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';

    protected static ?int $navigationSort = -2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                FileUpload::make('avatar')
                    ->image()
                    ->disk('public')
                    ->directory('avatars')
                    ->dehydrated(fn ($state) => filled($state)),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->unique(column: 'email', ignoreRecord: true)
                    ->email()
                    ->required(fn (Get $get): bool => $get('user_type') === true)
                    ->maxLength(255),
                TextInput::make('phone_number')
                    ->label('Phone Number')
                    ->tel()
                    ->required()
                    ->maxLength(255),
                Textarea::make('address')
                    ->maxLength(65535),
                Select::make('role')
                    ->options(
                        DB::table('roles')
                            ->pluck('name', 'name')
                            ->mapWithKeys(function ($value, $key) {
                                return [$key => ucfirst($value)];
                            })
                    ),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(function (string $context, Get $get, ?Model $record): bool {
                        $userType = $get('user_type');

                        if ($context === 'create') {
                            return $userType === true;
                        }

                        return $record->password === null && $userType === true;
                    })
                    ->maxLength(255),
                Toggle::make('user_type')
                    ->label('User Type (Offline/Online)')
                    ->live()
                    ->onIcon('heroicon-s-user-circle')
                    ->offIcon('heroicon-s-user-circle')
                    ->onColor('success')
                    ->offColor('danger')
                    ->inline(false),
                Toggle::make('is_active')
                    ->label('Account Status')
                    ->default(true)
                    ->onIcon('heroicon-s-no-symbol')
                    ->offIcon('heroicon-s-no-symbol')
                    ->onColor('success')
                    ->offColor('danger')
                    ->inline(false)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\Layout\Split::make([
                    ImageColumn::make('avatar')
                        ->circular()
                        ->grow(false),
                    Tables\Columns\Layout\Stack::make([
                        TextColumn::make('name')
                            ->searchable()
                            ->weight(FontWeight::Bold)
                            ->sortable(),
                        TextColumn::make('email')
                            ->searchable()
                            ->sortable(),
                    ]),
                    Tables\Columns\Layout\Stack::make([
                        TextColumn::make('phone_number')
                            ->searchable()
                            ->sortable()
                            ->icon('heroicon-s-phone'),
                        TextColumn::make('address')
                            ->searchable()
                            ->sortable()
                            ->icon('heroicon-s-envelope'),
                    ]),
                    TextColumn::make('user_type')
                        ->badge()
                        ->formatStateUsing(fn (string $state): string => match ($state) {
                            '0' => 'Offline',
                            '1' => 'Online',
                        })
                        ->color(fn (string $state): string => match ($state) {
                            '0' => 'danger',
                            '1' => 'success',
                        }),
                    ToggleColumn::make('is_active')
                        ->tooltip('Account Status')
                        ->onIcon('heroicon-s-no-symbol')
                        ->offIcon('heroicon-s-no-symbol')
                        ->onColor('success')
                        ->offColor('danger')
                        ->grow(false)
                        ->alignEnd()
                ])
            ])
            ->recordUrl(null)
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
