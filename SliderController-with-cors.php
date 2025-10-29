<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SliderController extends Controller
{
    // GET /api/sliders
    public function index()
    {
        $items = Slider::orderBy('ordering')->orderBy('id')->get();
        
        $response = response()->json([
            'success' => true,
            'data' => $items,
        ]);

        // Add CORS headers
        return $this->addCorsHeaders($response);
    }

    // POST /api/sliders (multipart form-data with image file)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => ['required','image','mimes:jpg,jpeg,png,webp,gif','max:5120'], // 5 MB
            'ordering' => ['nullable','integer','min:0']
        ]);
        if ($validator->fails()) {
            $response = response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            return $this->addCorsHeaders($response);
        }

        // store file
        $path = $request->file('image')->store('sliders', 'public');

        // Determine ordering: if not provided, set to max(ordering)+1 (starting at 1)
        $nextOrdering = (int) (Slider::max('ordering') ?? 0) + 1;
        $payload = [
            'image' => '/storage/' . $path,
            'ordering' => $request->filled('ordering') ? (int) $request->input('ordering') : $nextOrdering,
        ];
        $item = Slider::create($payload);

        $response = response()->json(['success' => true, 'message' => 'Slider created successfully', 'data' => $item], 201);
        return $this->addCorsHeaders($response);
    }

    // GET /api/sliders/{id}
    public function show($id)
    {
        $item = Slider::find($id);
        if (!$item) {
            $response = response()->json(['success' => false, 'message' => 'Slider not found'], 404);
            return $this->addCorsHeaders($response);
        }
        
        $response = response()->json(['success' => true, 'data' => $item]);
        return $this->addCorsHeaders($response);
    }

    // PUT/PATCH /api/sliders/{id} (can replace image)
    public function update(Request $request, $id)
    {
        $item = Slider::find($id);
        if (!$item) {
            $response = response()->json(['success' => false, 'message' => 'Slider not found'], 404);
            return $this->addCorsHeaders($response);
        }

        $validator = Validator::make($request->all(), [
            'image' => ['nullable','image','mimes:jpg,jpeg,png,webp,gif','max:1048576'],
            'ordering' => ['nullable','integer','min:0']
        ]);
        if ($validator->fails()) {
            $response = response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            return $this->addCorsHeaders($response);
        }

        if ($request->hasFile('image')) {
            // delete old file if exists
            $this->deleteFileIfExists($item->image);
            $path = $request->file('image')->store('sliders', 'public');
            $item->image = '/storage/' . $path;
        }
        if ($request->filled('ordering')) {
            $item->ordering = (int) $request->input('ordering');
        }
        $item->save();

        $response = response()->json(['success' => true, 'message' => 'Slider updated successfully', 'data' => $item]);
        return $this->addCorsHeaders($response);
    }

    // PATCH /api/sliders/{id}/ordering
    public function updateOrdering(Request $request, $id)
    {
        $item = Slider::find($id);
        if (!$item) {
            $response = response()->json(['success' => false, 'message' => 'Slider not found'], 404);
            return $this->addCorsHeaders($response);
        }

        $validator = Validator::make($request->all(), [
            'ordering' => ['required','integer','min:0']
        ]);
        if ($validator->fails()) {
            $response = response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            return $this->addCorsHeaders($response);
        }

        $item->ordering = (int) $request->input('ordering');
        $item->save();
        
        $response = response()->json(['success' => true, 'message' => 'Ordering updated successfully', 'data' => $item]);
        return $this->addCorsHeaders($response);
    }

    // DELETE /api/sliders/{id}
    public function destroy($id)
    {
        $item = Slider::find($id);
        if (!$item) {
            $response = response()->json(['success' => false, 'message' => 'Slider not found'], 404);
            return $this->addCorsHeaders($response);
        }

        $this->deleteFileIfExists($item->image);
        $item->delete();
        
        $response = response()->json(['success' => true, 'message' => 'Slider deleted successfully']);
        return $this->addCorsHeaders($response);
    }

    // POST /api/sliders/url { url: "https://..." }
    public function fromUrl(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => ['required','url'],
            'ordering' => ['nullable','integer','min:0']
        ]);
        if ($validator->fails()) {
            $response = response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            return $this->addCorsHeaders($response);
        }

        $url = $request->input('url');

        try {
            $client = new Client([
                'timeout' => 15,
                'verify' => false, // in case of self-signed sources; consider enabling in production
                'headers' => [
                    'User-Agent' => 'SD-Auto-Slider/1.0'
                ],
                'allow_redirects' => [
                    'max' => 3
                ]
            ]);
            $response = $client->get($url, ['stream' => true]);
            $status = $response->getStatusCode();
            if ($status < 200 || $status >= 300) {
                $response = response()->json(['success' => false, 'message' => 'Failed to fetch image from URL'], 422);
                return $this->addCorsHeaders($response);
            }

            $contentType = $response->getHeaderLine('Content-Type');
            $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
            if (!isset($allowed[$contentType])) {
                $response = response()->json(['success' => false, 'message' => 'Unsupported image type: ' . $contentType], 422);
                return $this->addCorsHeaders($response);
            }
            $ext = $allowed[$contentType];

            // Enforce max size ~ 5 MB
            $maxBytes = 5 * 1024 * 1024;
            $body = '';
            $stream = $response->getBody();
            while (!$stream->eof()) {
                $chunk = $stream->read(1024 * 64);
                $body .= $chunk;
                if (strlen($body) > $maxBytes) {
                    $response = response()->json(['success' => false, 'message' => 'Image exceeds 5MB limit'], 422);
                    return $this->addCorsHeaders($response);
                }
            }

            // Generate unique filename
            $filename = 'sliders/' . now()->format('Ymd_His') . '_' . Str::random(10) . '.' . $ext;
            Storage::disk('public')->put($filename, $body);

            $nextOrdering = (int) (Slider::max('ordering') ?? 0) + 1;
            $payload = [
                'image' => '/storage/' . $filename,
                'ordering' => $request->filled('ordering') ? (int) $request->input('ordering') : $nextOrdering,
            ];
            $item = Slider::create($payload);

            $response = response()->json(['success' => true, 'message' => 'Slider created successfully', 'data' => $item], 201);
            return $this->addCorsHeaders($response);
        } catch (\Throwable $e) {
            Log::error('fromUrl error: ' . $e->getMessage());
            $response = response()->json(['success' => false, 'message' => 'Unable to download image'], 500);
            return $this->addCorsHeaders($response);
        }
    }

    private function deleteFileIfExists($publicPath)
    {
        if (!$publicPath) return;
        // $publicPath example: /storage/sliders/xyz.jpg -> convert to storage path
        $relative = ltrim($publicPath, '/'); // storage/sliders/xyz.jpg
        if (str_starts_with($relative, 'storage/')) {
            $diskPath = substr($relative, strlen('storage/'));
            Storage::disk('public')->delete($diskPath);
        }
    }

    /**
     * Add CORS headers to response
     */
    private function addCorsHeaders($response)
    {
        return $response->header('Access-Control-Allow-Origin', '*')
                       ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                       ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
