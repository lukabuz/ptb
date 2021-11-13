<?php

namespace App\Models;

use App\Helpers\UserAgentHelper;
use Carbon\Carbon;
use Exception;
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

        $locationBasket = $this->getLocationBasket();

        for ($i=0; $i < count($locationBasket); $i++) {
            $startTime->addSeconds($intervalBetweenVisits);
            Job::create([
                "order_id" => $this->id,
                "proxy_country" => $locationBasket[$i],
                "status" => "NEW",
                "user_agent" => UserAgentHelper::getUserAgent(),
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

    private function getLocationBasket(){
        $locationBasket = [];
        foreach ($this->locations as $key => $value) {
            for ($i=0; $i < $this->visitor_counts[$key]; $i++) {
                array_push($locationBasket, $value);
            }
        }
        return $locationBasket;
    }

    private function getApplicableProxies($location){
        $count = Proxy::where('location', $location)->count();
        if($count == 0){
            // Put into failed state
            $this->status = "CLOSED";
            $this->closing_reason = "No Locations Matched";
            $this->save();
            abort(404);
        };
        return true;
    }

    public function getJobStatusAttribute(){
        return DB::table('jobs')
            ->select(DB::raw('count(*) as count, status'))
            ->where('order_id', $this->id)
            ->groupBy('status')
            ->get();
    }
}
