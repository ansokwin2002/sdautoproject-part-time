<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\PolicyController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1'); // basic rate limit

// Fallback for unauthenticated access when middleware redirects to 'login' route name
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized.'], 401);
})->name('login');

// 🔥 PUBLIC Home Settings routes (for frontend header data)
Route::get('public/settings', [SettingController::class, 'index']);        // ✅ Public - for frontend
Route::get('public/settings/{id}', [SettingController::class, 'show']);     // ✅ Public - for frontend

// 🔥 PUBLIC Slider routes (for frontend carousel)
Route::get('public/sliders', [SliderController::class, 'index']); // ✅ Public - for frontend

// 🔥 PUBLIC Shipping routes (for frontend shipping page)
Route::get('public/shipping', [\App\Http\Controllers\Api\ShippingController::class, 'index']); // ✅ Public - for frontend

// 🔥 PUBLIC Policy routes (for frontend policy page)
Route::prefix('public/policies')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\PolicyController::class, 'index']); // ✅ Public - for frontend
    Route::get('/{id}', [\App\Http\Controllers\Api\PolicyController::class, 'show']); // ✅ Public - for frontend
});

// 🔥 PUBLIC FAQ routes (for frontend FAQ page)
Route::prefix('public/faqs')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\FaqController::class, 'index']); // ✅ Public - for frontend
    Route::get('/{id}', [\App\Http\Controllers\Api\FaqController::class, 'show']); // ✅ Public - for frontend
});

// Protected routes with Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    // 🔒 PROTECTED Home Settings routes (for admin management)
    Route::prefix('home-settings')->group(function () {
        Route::post('/', [SettingController::class, 'store']);       // 🔒 Protected - admin only
        Route::put('/{id}', [SettingController::class, 'update']);   // 🔒 Protected - admin only
        Route::patch('/{id}', [SettingController::class, 'update']); // 🔒 Protected - admin only
    });

    // Slider API routes (CRUD, file upload)
    Route::prefix('sliders')->group(function () {
        Route::get('/', [SliderController::class, 'index']);
        // multipart upload (field: image)
        Route::post('/', [SliderController::class, 'store']);
        Route::post('/upload', [SliderController::class, 'store']);
        // create from remote image URL
        Route::post('/url', [SliderController::class, 'fromUrl']);

        Route::get('/{id}', [SliderController::class, 'show']);
        Route::put('/{id}', [SliderController::class, 'update']);
        Route::patch('/{id}', [SliderController::class, 'update']);
        Route::patch('/{id}/ordering', [SliderController::class, 'updateOrdering']);
        Route::delete('/{id}', [SliderController::class, 'destroy']);
    });

    // Shipping API routes (no delete per request)
    Route::prefix('shippings')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\ShippingController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\ShippingController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\ShippingController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\Api\ShippingController::class, 'update']);
        Route::patch('/{id}', [\App\Http\Controllers\Api\ShippingController::class, 'update']);
    });

    // Policy API routes
    Route::prefix('policies')->group(function () {
        Route::get('/', [PolicyController::class, 'index']);
        Route::post('/', [PolicyController::class, 'store']);
        Route::get('/{id}', [PolicyController::class, 'show']);
        Route::put('/{id}', [PolicyController::class, 'update']);
        Route::patch('/{id}', [PolicyController::class, 'update']);
    });

    // FAQ API routes
    Route::prefix('faqs')->group(function () {
        Route::get('/', [FaqController::class, 'index']);
        Route::post('/', [FaqController::class, 'store']);
        Route::get('/{id}', [FaqController::class, 'show']);
        Route::put('/{id}', [FaqController::class, 'update']);
        Route::patch('/{id}', [FaqController::class, 'update']);
        Route::delete('/{id}', [FaqController::class, 'destroy']);
    });

    // Contact API routes
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::post('/', [ContactController::class, 'store']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::put('/{id}', [ContactController::class, 'update']);
        Route::patch('/{id}', [ContactController::class, 'update']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });

    // Product API routes
    Route::prefix('products')->group(function () {
        Route::get('/stats', [ProductController::class, 'getStats']);
        Route::get('/brands', [ProductController::class, 'getBrands']);
        Route::get('/categories', [ProductController::class, 'getCategories']);
        Route::get('/on-sale', [ProductController::class, 'getOnSaleProducts']);
        Route::post('/bulk', [ProductController::class, 'bulkOperation']);
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);
        Route::get('/{product}', [ProductController::class, 'show'])->missing(function (Request $request) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        });
        Route::put('/{product}', [ProductController::class, 'update'])->missing(function (Request $request) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        });
        Route::patch('/{product}', [ProductController::class, 'update'])->missing(function (Request $request) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        });
        Route::delete('/{product}', [ProductController::class, 'destroy'])->missing(function (Request $request) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        });
        Route::patch('/{product}/stock', [ProductController::class, 'updateStock']);
        Route::patch('/{product}/discount', [ProductController::class, 'applyDiscount']);
        Route::delete('/{product}/images', [ProductController::class, 'deleteImage']);
        Route::delete('/{product}/videos', [ProductController::class, 'deleteVideo']);
    });
});
