<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Send a success response.
     *
     * @param mixed $result
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public function successResponse($result, $message = 'Success', $code = 200): JsonResponse
    {
        return response()->json([
            'statusCode' => $code,
            'statusMessage' => $message,
            'Result' => $result,
        ], $code);
    }

    /**
     * Send an error response.
     *
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public function errorResponse($message, $code = 404): JsonResponse
    {
        return response()->json([
            'statusCode' => $code,
            'statusMessage' => $message,
            'Result' => null,
        ], $code);
    }
}
