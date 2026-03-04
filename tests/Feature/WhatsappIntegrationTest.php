<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use App\Models\User;
use App\Models\WhatsappContact;
use App\Models\WhatsappList;
use App\Models\Setting;
use App\Services\WhatsappService;

class WhatsappIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
        $this->service = app(WhatsappService::class);
    }

    private function setupSettings(array $overrides = [])
    {
        $defaults = [
            'whatsapp_provider' => 'meta',
            'whatsapp_api_key' => 'test_token_123',
            'whatsapp_instance_id' => 'test_phone_id',
        ];

        foreach (array_merge($defaults, $overrides) as $key => $value) {
            Setting::updateOrCreate(
                ['user_id' => $this->user->id, 'key' => $key],
                ['value' => $value]
            );
        }
    }

    public function test_meta_cloud_gateway_success()
    {
        $this->setupSettings(['whatsapp_provider' => 'meta']);

        Http::fake([
            'https://graph.facebook.com/*' => Http::response([
                'messages' => [['id' => 'wamid.12345']]
            ], 200),
        ]);

        $contact = new WhatsappContact(['phone_number' => '+1234567890', 'name' => 'John']);
        
        $response = $this->service->sendMessage($contact, 'Hello Test');

        $this->assertTrue($response['success']);
        $this->assertEquals('wamid.12345', $response['message_id']);
        
        Http::assertSent(function (\Illuminate\Http\Client\Request $request) {
            return $request->url() === 'https://graph.facebook.com/v19.0/test_phone_id/messages' &&
                   $request->hasHeader('Authorization', 'Bearer test_token_123');
        });
    }

    public function test_meta_cloud_gateway_failure()
    {
        $this->setupSettings(['whatsapp_provider' => 'meta']);

        Http::fake([
            'https://graph.facebook.com/*' => Http::response([
                'error' => ['message' => 'Invalid token']
            ], 401),
        ]);

        $contact = new WhatsappContact(['phone_number' => '+1234567890']);
        
        $response = $this->service->sendMessage($contact, 'Hello Test');

        $this->assertFalse($response['success']);
        $this->assertEquals('Invalid token', $response['error']);
    }

    public function test_twilio_gateway_success()
    {
        $this->setupSettings([
            'whatsapp_provider' => 'twilio',
            'whatsapp_instance_id' => 'AC123456789', // Account SID
            'whatsapp_api_key' => 'auth_token_abc',
            'whatsapp_webhook_url' => 'whatsapp:+11234567890' // Simulated from_number setup
        ]);

        Http::fake([
            'https://api.twilio.com/*' => Http::response([
                'sid' => 'SM123456789'
            ], 201), // Twilio returns 201 Created
        ]);

        $contact = new WhatsappContact(['phone_number' => '+0987654321']);
        
        $response = $this->service->sendMessage($contact, 'Hello Twilio');

        $this->assertTrue($response['success']);
        $this->assertEquals('SM123456789', $response['message_id']);
    }

    public function test_custom_gateway_success()
    {
        $this->setupSettings([
            'whatsapp_provider' => 'custom',
            'whatsapp_webhook_url' => 'https://custom-api.example.com/send',
            'whatsapp_api_key' => 'custom_token_xyz',
        ]);

        Http::fake([
            'https://custom-api.example.com/*' => Http::response([
                'messageId' => 'custom_msg_001'
            ], 200),
        ]);

        $contact = new WhatsappContact(['phone_number' => '+1122334455']);
        
        $response = $this->service->sendMessage($contact, 'Hello Custom');

        $this->assertTrue($response['success']);
        $this->assertEquals('custom_msg_001', $response['message_id']);
    }
}
