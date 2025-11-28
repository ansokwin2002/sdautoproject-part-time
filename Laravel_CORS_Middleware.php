<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * CORS Middleware for SD Auto API
 * 
 * This middleware adds CORS headers to allow your Next.js frontend
 * to communicate with your Laravel backend API.
 * 
 * Installation:
 * 1. Copy this file to: app/Http/Middleware/Cors.php
 * 2. Register in app/Http/Kernel.php:
 *    protected $middleware = [
 *        // ...
 *        \App\Http\Middleware\Cors::class,
 *    ];
 * 3. Restart your Laravel server
 */
class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                ->header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
        }

        // Process the request and add CORS headers to response
        $response = $next($request);

        // Add CORS headers to the response
        return $response
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
            ->header('Access-Control-Expose-Headers', 'Content-Length, X-JSON')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
