<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProxyRequest;
use App\Models\Proxy;
use Illuminate\Http\Request;

class ProxyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            "status" => "success",
            "data" => Proxy::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(CreateProxyRequest $request)
    {
        $proxy = Proxy::create([
            "provider" => $request->input("provider"),
            "location" => $request->input("location"),
            "type" => $request->input("type"),
            "ip" => $request->input("ip"),
            "port" => $request->input("port"),
            "auth_type" => $request->input("auth_type"),
            "username" => $request->input("username"),
            "password" => $request->input("password"),
            "enabled" => true
        ]);

        return response()->json([
            "status" => "success",
            "data" => $proxy
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Proxy  $proxy
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Proxy $proxy)
    {
        //
    }
}
