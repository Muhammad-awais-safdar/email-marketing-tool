<?php

namespace App\Gateways\Contracts;

interface WhatsappGatewayInterface
{
    /**
     * Send a WhatsApp message to a specific number.
     *
     * @param string $to The destination phone number in E.164 format.
     * @param string $message The formatted message content.
     * @param array $config The gateway-specific configuration credentials.
     * @return array A standardized response array containing 'success', 'message_id', and optionally 'error'.
     * @throws \Exception If the integration encounters a critical failure.
     */
    public function send(string $to, string $message, array $config): array;
}
