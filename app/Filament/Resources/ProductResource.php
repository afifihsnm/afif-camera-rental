<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Product';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn(Set $set, ?string $state) => $set('slug', Str::slug($state)))
                    ->required()
                    ->maxLength(255),
                TextInput::make('slug')
                    ->unique(column: 'slug', ignoreRecord: true)
                    ->required()
                    ->maxLength(255),
                Select::make('product_category_id')
                    ->relationship(name: 'productCategory', titleAttribute: 'name')
                    ->label('Category')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('product_brand_id')
                    ->relationship(name: 'productBrand', titleAttribute: 'name')
                    ->label('Brand')
                    ->searchable()
                    ->preload()
                    ->required(),
                Textarea::make('description')
                    ->maxLength(65535),
                FileUpload::make('images')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->disk('public')
                    ->directory('products')
                    ->required(),
                TextInput::make('rate_24h')
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
                TextInput::make('rate_12h')
                    ->numeric()
                    ->minValue(1)
                    ->prefix('Rp')
                    ->mask(RawJs::make(<<<'JS'
                        function (value) {
                            let number = value.replace(/\D/g, '');
                            return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                    JS))
                    ->stripCharacters('.'),
                TextInput::make('late_fee')
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
                TextInput::make('stock')
                    ->integer()
                    ->minValue(0)
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
                Tables\Columns\Layout\Split::make([
                    ImageColumn::make('images')
                        ->square()
                        ->stacked()
                        ->limit(2)
                        ->limitedRemainingText()
                        ->grow(false),
                    Tables\Columns\Layout\Stack::make([
                        TextColumn::make('title')
                            ->searchable()
                            ->weight(FontWeight::Bold)
                            ->sortable(),
                        TextColumn::make('stock')
                            ->prefix('Stock: ')
                            ->searchable()
                            ->sortable(),
                    ]),
                    Tables\Columns\Layout\Stack::make([
                        TextColumn::make('rate_12h')
                            ->numeric(locale: 'id')
                            ->prefix('Price/12h: ')
                            ->searchable()
                            ->sortable(),
                        TextColumn::make('rate_24h')
                            ->numeric(locale: 'id')
                            ->prefix('Price/day: ')
                            ->searchable()
                            ->sortable(),
                        TextColumn::make('late_fee')
                            ->numeric(locale: 'id')
                            ->prefix('Hourly Late Fee: ')
                            ->searchable()
                            ->sortable(),
                    ]),
                    Tables\Columns\Layout\Stack::make([
                        TextColumn::make('productCategory.name')
                            ->numeric(locale: 'id')
                            ->prefix('Category: ')
                            ->searchable()
                            ->sortable(),
                        TextColumn::make('productBrand.name')
                            ->numeric(locale: 'id')
                            ->prefix('Brand: ')
                            ->searchable()
                            ->sortable(),
                    ]),
                ])
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
