<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RentResource\Pages;
use App\Models\Product;
use App\Models\Rent;
use Carbon\Carbon;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class RentResource extends Resource
{
    protected static ?string $model = Rent::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-date-range';

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
                    // ->afterStateUpdated(function (Get $get, Set $set, $state, $old) {
                    //     $rentDetails = collect($get('rentDetails'));

                    //     if ($state === 2) {
                    //         try {
                    //             foreach ($rentDetails as $detail) {
                    //                 if (empty($detail['product_id']) || empty($detail['qty'])) {
                    //                     continue;
                    //                 }

                    //                 $product = Product::find($detail['product_id']);
                    //                 if (!$product || $product->stock < $detail['qty']) {
                    //                     throw new \Exception("Insufficient stock for product: {$product->title}");
                    //                 }
                    //             }
                    //         } catch (\Exception $e) {
                    //             $set('status', $old);
                    //             Notification::make()
                    //                 ->title('Stock Error')
                    //                 ->body($e->getMessage())
                    //                 ->danger()
                    //                 ->send();
                    //         }
                    //     } elseif ($state === 0) {
                    //         $lowStockProducts = [];

                    //         foreach ($rentDetails as $detail) {
                    //             if (empty($detail['product_id']) || empty($detail['qty'])) {
                    //                 continue;
                    //             }

                    //             $product = Product::find($detail['product_id']);
                    //             if ($product && $product->stock < $detail['qty']) {
                    //                 $lowStockProducts[] = [
                    //                     'name' => $product->title,
                    //                     'requested' => $detail['qty'],
                    //                     'available' => $product->stock
                    //                 ];
                    //             }
                    //         }

                    //         if (!empty($lowStockProducts)) {
                    //             $warningMessage = "Low stock warning:\n";
                    //             foreach ($lowStockProducts as $product) {
                    //                 $warningMessage .= "- {$product['name']}: Requested {$product['requested']}, only {$product['available']} available\n";
                    //             }

                    //             Notification::make()
                    //                 ->title('Low Stock Warning')
                    //                 ->body($warningMessage)
                    //                 ->warning()
                    //                 ->persistent()
                    //                 ->send();
                    //         }
                    //     }
                    // })
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

    public static function updatePrice(Get $get, Set $set): void
    {
        $selectedProducts = collect($get('rentDetails'))->filter(fn($item) => !empty($item['product_id']) && !empty($item['qty']));
        $prices = DB::table('products')->whereIn('id', $selectedProducts->pluck('product_id'))->get(['id', 'rate_24h', 'rate_12h', 'late_fee'])->keyBy('id');

        // Get rental duration
        $startDate = $get('start_date') ? Carbon::parse($get('start_date')) : null;
        $endDate = $get('end_date') ? Carbon::parse($get('end_date')) : null;

        // Reset subtotal if dates dates are invalid
        if (!$startDate || !$endDate || $endDate < $startDate) {
            $set('subtotal', 0);
            $set('total', 0);
            return;
        }

        // Calculate duration with minimum 12h enforcement
        $rentalDurationHours = max($startDate->diffInHours($endDate), 12);

        // Calculate subtotal price
        $subtotal = $selectedProducts->reduce(function ($subtotal, $product) use ($prices, $rentalDurationHours) {
            $productPrice = $prices[$product['product_id']] ?? null;
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

        // Calculate late fee if status is Returned/Completed and returned_date is provided
        $lateFee = 0;
        $status = $get('status');
        $returnedDate = $get('returned_date');

        if (in_array($status, [3, 4]) && $returnedDate) {
            $returnedDateTime = Carbon::parse($returnedDate);

            if ($returnedDateTime->gt($endDate)) {
                $totalLateMinutes = $endDate->diffInMinutes($returnedDateTime);
                $lateHours = ceil($totalLateMinutes / 60); // Round up to nearest hour

                $lateFee = $selectedProducts->sum(function ($product) use ($prices, $lateHours) {
                    $productPrice = $prices[$product['product_id']] ?? null;
                    return $productPrice ? $lateHours * $product['qty'] * $productPrice->late_fee : 0;
                });
            }
        }

        $set('subtotal', $subtotal);
        $set('total', $subtotal + $lateFee);
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
