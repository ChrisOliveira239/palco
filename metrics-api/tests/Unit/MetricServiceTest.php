<?php
namespace Tests\Unit;

use App\Repositories\MetricRepository;
use App\Services\MetricService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\TestCase;

class MetricServiceTest extends TestCase {
    private MockInterface $repo;
    private MetricService $service;

    protected function setUp(): void {
        parent::setUp();

        $this->repo = Mockery::mock(MetricRepository::class);
        $this->service = new MetricService($this->repo);
    }

    protected function tearDown(): void {
        Mockery::close(); // limpa mocks — obrigatório
        parent::tearDown();
    }

    // --- recordSale ---

    public function test_record_sale_passes_correct_data_to_repository(): void {
        $payload = [
            'event_id' => 'evt-1',
            'artist_id' => 'art-1',
            'ticket_id' => 'tkt-1',
            'amount' => 50.00,
        ];

        // Aqui está o mock: espera receber exatamente esses dados + type='sale'
        $this->repo
            ->shouldReceive('create')
            ->once()
            ->with([
                'event_id' => 'evt-1',
                'artist_id' => 'art-1',
                'ticket_id' => 'tkt-1',
                'amount' => 50.00,
                'type' => 'sale',
            ])
            ->andReturn(new \App\Models\Metric([
                'event_id' => 'evt-1',
                'artist_id' => 'art-1',
                'ticket_id' => 'tkt-1',
                'amount' => 50.00,
                'type' => 'sale',
            ]));

        $result = $this->service->recordSale($payload);

        $this->assertEquals('art-1', $result['artist_id']);
        $this->assertEquals(50.00, $result['amount']);
    }

    public function test_record_sale_always_sets_type_as_sale(): void {
        $payload = [
            'event_id' => 'evt-2',
            'artist_id' => 'art-2',
            'ticket_id' => 'tkt-2',
            'amount' => 25.00,
        ];

        $this->repo
            ->shouldReceive('create')
            ->once()
            ->withArgs(fn(array $data) => $data['type'] === 'sale') // verifica só o type
            ->andReturn(new \App\Models\Metric($payload + ['type' => 'sale']));

        $this->service->recordSale($payload);

        // Mockery verifica o ->once() automaticamente no tearDown
        $this->assertTrue(true);
    }

    // --- getSummaryByArtist ---

    public function test_summary_calculates_total_revenue_and_tickets(): void {
        // Simula 3 vendas do MongoDB retornando como Collection
        $fakeMetrics = new Collection([
            new \App\Models\Metric(['amount' => 50.00, 'event_id' => 'evt-1']),
            new \App\Models\Metric(['amount' => 30.00, 'event_id' => 'evt-1']),
            new \App\Models\Metric(['amount' => 20.00, 'event_id' => 'evt-2']),
        ]);

        $this->repo
            ->shouldReceive('revenueByArtist')
            ->once()
            ->with('art-1')
            ->andReturn($fakeMetrics);

        $result = $this->service->getSummaryByArtist('art-1');

        $this->assertEquals('art-1', $result['artist_id']);
        $this->assertEquals(100.00, $result['total_revenue']);
        $this->assertEquals(3, $result['total_tickets']);
    }

    public function test_summary_returns_zero_when_no_sales(): void {
        $this->repo
            ->shouldReceive('revenueByArtist')
            ->once()
            ->with('art-sem-vendas')
            ->andReturn(new Collection([]));

        $result = $this->service->getSummaryByArtist('art-sem-vendas');

        $this->assertEquals(0, $result['total_revenue']);
        $this->assertEquals(0, $result['total_tickets']);
    }
}
