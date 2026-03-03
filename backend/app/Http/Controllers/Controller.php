<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use App\Traits\ApiResponse;

abstract class Controller extends BaseController
{
    use ApiResponse;
}
