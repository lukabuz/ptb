<?php

namespace App\Models;

use Carbon\Carbon;
use Faker\Provider\UserAgent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        "destination_url",
        "use_redirect_link",
        "redirect_url",
        "referrers",
        "locations",
        "keywords",
        "start_time",
        "end_time",
        "page_idle_time",
        "visitor_counts",
        "status",
        "is_paid",
        "closing_reason"
    ];

    protected $casts = [
        'referrers' => 'array',
        'locations' => 'array',
        'keywords' => 'array',
        'visitor_counts' => 'array'
    ];

    protected $appends = [
        'jobStatus'
    ];

    public function scheduleJobs(){
        $startTime = Carbon::createFromDate($this->start_time);
        $endTime = Carbon::createFromDate($this->end_time);
        $durationSeconds = $endTime->diffInSeconds($startTime);
        $intervalBetweenVisits = floor($durationSeconds / array_sum($this->visitor_counts));

        $proxyBasket = $this->getProxyBasket();

        for ($i=0; $i < count($proxyBasket); $i++) {
            $startTime->addSeconds($intervalBetweenVisits);
            Job::create([
                "order_id" => $this->id,
                "proxy_id" => $proxyBasket[$i],
                "status" => "NEW",
                "user_agent" => \Campo\UserAgent::random([
                    "os_type" => ["Android", "iOS", "Windows", "OS X", "Windows"],
                    "device_type" => ["Mobile", "Tablet", "Desktop"]
                ]),
                "execute_after" => $startTime,
                "referrer" => $this->referrers[array_rand($this->referrers)],
                "keyword" => $this->keywords[array_rand($this->keywords)],
                "destination_url" => $this->use_redirect_link ? $this->redirect_url : $this->destination_url
            ]);
        }

        $this->status = "IN_PROGRESS";
        $this->save();
        return true;
    }

    private function getProxyBasket(){
        $proxyBasket = [];
        foreach ($this->locations as $key => $value) {
            $applicableProxies = $this->getApplicableProxies($value);
            for ($i=0; $i < $this->visitor_counts[$key]; $i++) {
                array_push($proxyBasket, $applicableProxies[array_rand($applicableProxies)]["id"]);
            }
        }
        return $proxyBasket;
    }

    private function getApplicableProxies($location){
        $proxy = Proxy::where('location', $location)->get()->toArray();
        if(count($proxy) == 0){
            // Put into failed state
            $this->status = "CLOSED";
            $this->closing_reason = "No Locations Matched";
            $this->save();
            return false;
        };
        return $proxy;
    }

    public function getJobStatusAttribute(){
        return DB::table('jobs')
            ->select(DB::raw('count(*) as count, status'))
            ->where('order_id', $this->id)
            ->groupBy('status')
            ->get();
    }
}
