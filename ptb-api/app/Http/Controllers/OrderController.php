<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    //

    public function create(CreateOrderRequest $request){
        $order = Order::create([
            "destination_url" => $request->input('destination_url'),
            "use_redirect_link" => $request->input('use_redirect_link') == 'true',
            "referrers" => $request->input('referrers'),
            "locations" => $request->input('locations'),
            "keywords" => $request->input('keywords'),
            "start_time" => $request->input('start_time'),
            "end_time" => $request->input('end_time'),
            "visitor_counts" => $request->input('visitor_counts'),
            "page_idle_time" => $request->input('page_idle_time'),
            "status" => "CREATED",
            "is_paid" => false,
            "redirect_url" =>
                $request->input('use_redirect_link') == 'true' ?
                    $this->getCutlyRedirectLink($request->input('destination_url')) :
                    null
        ]);

        $order->scheduleJobs();

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    public function index(){
        return response()->json([
            'status' => 'success',
            'data' => Order::all()
        ]);
    }

    public function locations(){
        return response()->json([
            'status' => 'success',
            'data' => DB::table('proxies')
                ->select('location')
                ->where('enabled', true)
                ->groupBy('location')
                ->get()
        ]);
    }

    public function close($id){
        $order = Order::findOrFail($id);
        $order->status = 'CLOSED';
        $order->save();

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    private function getCutlyRedirectLink($url){
        $apiKey = env("CUTLY_API_KEY");
        $json = file_get_contents("https://cutt.ly/api/api.php?key=$apiKey&short=$url&public=1");
        $data = json_decode ($json, true);
        return $data['url']['shortLink'];
    }
}
