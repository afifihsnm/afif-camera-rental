<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RentResource\Pages;
use App\Models\Rent;
use App\Services\RentService;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RentResource extends Resource
{
    protected static ?string $model = Rent::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-date-range';

	private static ?RentService $pricingService = null;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('status')
                    ->options([
                        0 => 'Pending',
                        1 => 'Confirmed',
                        2 => 'Rented',
                        3 => 'Returned',
                        4 => 'Completed',
                        5 => 'Cancelled',
                        6 => 'Unresolved',
                    ])
                    ->live(debounce: 500)
                    ->required(),
                DateTimePicker::make('start_date')
                    ->native(false)
                    ->seconds(false)
                    ->minutesStep(5)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (Set $set) {
                        $set('end_date', null);
                    })
                    ->required(),
                DateTimePicker::make('end_date')
                    ->native(false)
                    ->seconds(false)
                    ->minutesStep(5)
                    ->minDate(fn (Get $get): ?string => $get('start_date'))
                    ->afterStateUpdated(function (Get $get, Set $set) {
                        self::updatePrice($get, $set);
                    })
                    ->live(debounce: 500)
                    ->required(),
                DateTimePicker::make('returned_date')
                    ->label('Actual Return Date')
                    ->native(false)
                    ->seconds(false)
                    ->minutesStep(5)
                    ->visible(fn (Get $get): bool => in_array($get('status'), [3, 4])) // 3=Returned, 4=Completed
                    ->required(fn (Get $get): bool => in_array($get('status'), [3, 4]))
                    ->afterStateUpdated(function (Get $get, Set $set) {
                        self::updatePrice($get, $set);
                    })
                    ->live(debounce: 500),
                Repeater::make('rentDetails')
                    ->relationship()
                    ->label('Rent Products')
                    ->addActionLabel('Add Rent Product')
                    ->schema([
                        Select::make('product_id')
                            ->relationship(name: 'product', titleAttribute: 'title')
                            ->label('Product')
                            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('qty')
                            ->integer()
                            ->minValue(1)
                            ->default(1)
                            ->mask(RawJs::make(<<<'JS'
								function (value) {
									let number = value.replace(/\D/g, '');
									return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
								}
							JS))
							->stripCharacters('.')
                            ->required(),
                    ])
                    ->live(debounce: 500)
                    ->afterStateUpdated(function (Get $get, Set $set) {
                        self::updatePrice($get, $set);
                    })
                    ->deleteAction(
                        fn(Action $action) => $action->after(fn(Get $get, Set $set) => self::updatePrice($get, $set)),
                    )
                    ->required(),
                TextInput::make('subtotal')
                    ->numeric()
                    ->minValue(1)
                    ->readOnly()
                    ->prefix('Rp')
                    ->mask(RawJs::make(<<<'JS'
                        function (value) {
                            let number = value.replace(/\D/g, '');
                            return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                    JS))
                    ->stripCharacters('.')
                    ->required(),
                TextInput::make('total')
                    ->numeric()
                    ->minValue(1)
                    ->prefix('Rp')
                    ->mask(RawJs::make(<<<'JS'
                        function (value) {
                            let number = value.replace(/\D/g, '');
                            return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                    JS))
                    ->stripCharacters('.')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name'),
                TextColumn::make('start_date')
                    ->dateTime(),
                TextColumn::make('end_date')
                    ->dateTime(),
                TextColumn::make('returned_date')
                    ->dateTime(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        '0' => 'Pending',
                        '1' => 'Confirmed',
                        '2' => 'Rented',
                        '3' => 'Returned',
                        '4' => 'Completed',
                        '5' => 'Cancelled',
                        '6' => 'Unresolved',
                    }),
                TextColumn::make('subtotal')
                    ->numeric(locale: 'id')
                    ->prefix('Rp'),
                TextColumn::make('total')
                    ->numeric(locale: 'id')
                    ->prefix('Rp'),
            ])
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

    private static function getPricingService(): RentService
    {
        if (!self::$pricingService) {
            self::$pricingService = new RentService();
        }
        return self::$pricingService;
    }

    public static function updatePrice(Get $get, Set $set): void
    {
        $startDate = $get('start_date');
        $endDate = $get('end_date');
        $rentDetails = $get('rentDetails');

        // If we don't have the minimum required data, set prices to 0
        if (empty($startDate) || empty($endDate) || empty($rentDetails)) {
            $set('subtotal', 0);
            $set('total', 0);
            return;
        }

        $items = collect($rentDetails)->map(function($item) {
            return [
                'product_id' => $item['product_id'] ?? null,
                'qty' => $item['qty'] ?? null
            ];
        });

        $prices = self::getPricingService()->calculatePrice(
            $startDate,
            $endDate,
            $items,
            $get('returned_date')
        );

        $set('subtotal', $prices['subtotal']);
        $set('total', $prices['total']);
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
            'index' => Pages\ListRents::route('/'),
            'create' => Pages\CreateRent::route('/create'),
            'edit' => Pages\EditRent::route('/{record}/edit'),
        ];
    }
}
