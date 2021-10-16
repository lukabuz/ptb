<?php

namespace App\Helpers;

class UserAgentHelper
{
    public static $userAgentList = [
        "windows" => [
            "edge" => ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50"],
            "ie" => [
                "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
                "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
                "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko"
            ],
            "chrome" => [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
            ],
            "firefox" => [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/92.0",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/91.0"
            ]
        ],
        "osx" => [
            "safari" => [
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15"
            ],
            "chrome" => [
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
            ],
            "firefox" => [
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:93.0) Gecko/20100101 Firefox/93.0"
            ],
        ],
        "ios" => [
            "safari" => [
                "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
            ],
            "chrome" => [
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
            ],
            "firefox" => [
                "Mozilla/5.0 (iPhone; CPU iPhone OS 11_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/38.0 Mobile/15E148 Safari/605.1.15"
            ],
        ],
        "android" => [
            "chrome" => [
                "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; SM-N960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 10; LM-X420) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36"
            ],
            "firefox" => [
                "Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/93.0",
                "Mozilla/5.0 (Android 12; Mobile; LG-M255; rv:93.0) Gecko/93.0 Firefox/93.0"
            ],
        ],
    ];

    public static $weighedValues = [
        "values" => [
            "windows.edge",
            "windows.ie",
            "windows.chrome",
            "windows.firefox",
            "osx.firefox",
            "osx.safari",
            "ios.chrome",
            "ios.safari",
            "android.chrome",
            "android.firefox",
        ],
        "weights" => [
            0.60,
            0.85,
            15.0,
            5.5,
            1.0,
            17.2,
            04.0,
            20.0,
            35.0,
            0.79
        ]
    ];

    public static function getUserAgent() {
        $weightArray = UserAgentHelper::$weighedValues;
        $agent = explode(".", UserAgentHelper::weightedRandom($weightArray["values"], $weightArray["weights"]));
        $os = $agent[0];
        $browser = $agent[1];
        $agents = UserAgentHelper::$userAgentList[$os][$browser];
        return $agents[array_rand($agents)];
    }

    public static function weightedRandom($values, $weights){
        $count = count($values);
        $i = 0;
        $n = 0;
        $num = mt_rand(1, array_sum($weights));
        while($i < $count){
            $n += $weights[$i];
            if($n >= $num){
                break;
            }
            $i++;
        }
        return $values[$i];
    }
}




