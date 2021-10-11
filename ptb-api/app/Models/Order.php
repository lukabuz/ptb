<?php

namespace App\Models;

use Carbon\Carbon;
use Faker\Provider\UserAgent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        "visitor_count",
        "status",
        "is_paid",
        "closing_reason"
    ];

    protected $casts = [
        'referrers' => 'array',
        'locations' => 'array',
        'keywords' => 'array'
    ];

    public function scheduleJobs(){
        $proxies = Proxy::whereIn('location', $this->locations)->get()->toArray();
        if(count($proxies) == 0){
            // Put into failed state
            $this->status = "CLOSED";
            $this->closing_reason = "No Locations Matched";
            $this->save();
            return false;
        };

        $startTime = Carbon::createFromDate($this->start_time);
        $endTime = Carbon::createFromDate($this->end_time);
        $durationSeconds = $endTime->diffInSeconds($startTime);
        $intervalBetweenVisits = floor($durationSeconds / $this->visitor_count);

        for ($i=0; $i < $this->visitor_count; $i++) {
            Job::create([
                "order_id" => $this->id,
                "proxy_id" => $proxies[array_rand($proxies)]["id"],
                "status" => "NEW",
                "user_agent" => UserAgent::userAgent(),
                "execute_after" => $startTime->addSeconds($intervalBetweenVisits * $i),
                "referrer" => $this->referrers[array_rand($this->referrers)],
                "keyword" => $this->keywords[array_rand($this->keywords)],
                "destination_url" => $this->use_redirect_link ? $this->redirect_url : $this->destination_url
            ]);
        }

        $this->status = "IN_PROGRESS";
        $this->save();
        return true;
    }
}
