<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Campaign;
use App\Models\EmailList;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
class CampaignTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_campaign()
    {
        $user = User::factory()->create();
        $list = EmailList::create(['name' => 'Test List']);

        $response = $this->actingAs($user)->postJson('/api/campaigns', [
            'name' => 'Test Campaign',
            'subject' => 'Hello World',
            'content' => '<h1>Hi</h1>',
            'email_list_id' => $list->id,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'statusCode' => 201,
                'statusMessage' => 'Campaign created successfully',
                'Result' => [
                    'name' => 'Test Campaign',
                ],
            ]);
        $this->assertDatabaseHas('campaigns', ['name' => 'Test Campaign']);
    }

    public function test_can_send_campaign()
    {
        Queue::fake();

        $user = User::factory()->create();
        $list = EmailList::create(['name' => 'Test List']);
        $campaign = Campaign::create([
            'name' => 'Test Campaign',
            'subject' => 'Hello World',
            'content' => '<h1>Hi</h1>',
            'email_list_id' => $list->id,
        ]);

        $response = $this->actingAs($user)->postJson("/api/campaigns/{$campaign->id}/send");

        $response->assertStatus(200)
            ->assertJson([
                'statusCode' => 200,
                'statusMessage' => 'Campaign queued for sending',
                'Result' => null,
            ]);
        Queue::assertPushed(\App\Jobs\SendEmailCampaign::class);
    }
}
