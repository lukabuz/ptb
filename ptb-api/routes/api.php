<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('proxies', 'ProxyController@index');
Route::post('proxies', 'ProxyController@create');

Route::post('orders', 'OrderController@create');
Route::get('orders', 'OrderController@index');
Route::get('orders/locations', 'OrderController@locations');

Route::get('jobs', 'JobController@index');
