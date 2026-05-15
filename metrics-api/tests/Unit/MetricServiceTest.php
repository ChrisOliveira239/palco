<?php
namespace Tests\Unit;

use App\Models\Metric;
use App\Repositories\MetricRepository;
use App\Services\MetricService;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\DataProvider;
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
        Mockery::close();
        parent::tearDown();
    }

    // =========================================================
    // recordSale
    // =========================================================

    public function test_record_sale_passes_correct_data_to_repository(): void {
        $payload = [
            'event_id' => 'evt-1',
            'artist_id' => 'art-1',
            'ticket_id' => 'tkt-1',
            'amount' => 50.00,
        ];
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
            ->andReturn(new Metric([
                'event_id' => 'evt-1',
                'artist_id' => 'art-1',
                'ticket_id' => 'tkt-1',
                'amount' => 50.00,
                'type' => 'sale',
            ]));

        $result = $this->service->recordSale($payload);

        $this->assertEquals('art-1', $result['artist_id']);
        $this->assertEquals(50.00, $result['amount']);
        $this->assertEquals('sale', $result['type']);
    }

    public function test_record_sale_always_sets_type_as_sale(): void {
        $this->repo
            ->shouldReceive('create')
            ->once()
            ->withArgs(fn(array $data) => $data['type'] === 'sale')
            ->andReturn(new Metric(['type' => 'sale', 'amount' => 10.00]));

        $this->service->recordSale([
            'event_id' => 'evt-x',
            'artist_id' => 'art-x',
            'ticket_id' => 'tkt-x',
            'amount' => 10.00,
        ]);
    }

    // =========================================================
    // getSummaryByArtist
    // =========================================================

    public static function summaryDataProvider(): array {
        return [
            'venda única' => [
                ['_id' => 'art-1', 'total_revenue' => 75.00, 'total_tickets' => 1],
                75.00,
                1,
            ],
            'múltiplas vendas' => [
                ['_id' => 'art-1', 'total_revenue' => 300.00, 'total_tickets' => 5],
                300.00,
                5,
            ],
            'sem vendas' => [
                ['_id' => 'art-1', 'total_revenue' => 0, 'total_tickets' => 0],
                0,
                0,
            ],
        ];
    }

    #[DataProvider('summaryDataProvider')]
    public function test_summary_maps_repository_data_correctly(
        array $repoReturn,
        float $expectedRevenue,
        int $expectedTickets
    ): void {
        $this->repo
            ->shouldReceive('revenueByArtist')
            ->andReturn($repoReturn);

        $result = $this->service->getSummaryByArtist('art-1');

        $this->assertEquals('art-1', $result['artist_id']);
        $this->assertEquals($expectedRevenue, $result['total_revenue']);
        $this->assertEquals($expectedTickets, $result['total_tickets']);
    }

    public function test_summary_calls_repository_with_correct_artist_id(): void {
        $this->repo
            ->shouldReceive('revenueByArtist')
            ->once()
            ->with('art-especifico') // MOCK: verifica o argumento
            ->andReturn(['_id' => 'art-especifico', 'total_revenue' => 0, 'total_tickets' => 0]);

        $this->service->getSummaryByArtist('art-especifico');

        // Mockery verifica ->once()->with() no tearDown
        $this->assertTrue(true);
    }

    // =========================================================
    // getSalesByMonth
    // =========================================================

    public function test_get_sales_by_month_returns_repository_data(): void {
        $fakeData = [
            ['_id' => ['year' => 2025, 'month' => 1], 'total_revenue' => 100.00, 'total_tickets' => 2],
            ['_id' => ['year' => 2025, 'month' => 2], 'total_revenue' => 250.00, 'total_tickets' => 5],
        ];

        $this->repo
            ->shouldReceive('salesByMonth')
            ->once()
            ->with('art-1')
            ->andReturn($fakeData);

        $result = $this->service->getSalesByMonth('art-1');

        $this->assertCount(2, $result);
        $this->assertEquals(100.00, $result[0]['total_revenue']);
        $this->assertEquals(250.00, $result[1]['total_revenue']);
    }

    public function test_get_sales_by_month_returns_empty_array_when_no_sales(): void {
        $this->repo
            ->shouldReceive('salesByMonth')
            ->andReturn([]);

        $result = $this->service->getSalesByMonth('art-sem-vendas');

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    // =========================================================
    // getTopEventsByRevenue
    // =========================================================

    public function test_get_top_events_returns_sorted_repository_data(): void {
        $fakeData = [
            ['event_id' => 'evt-a', 'total_revenue' => 300.00, 'total_tickets' => 3],
            ['event_id' => 'evt-b', 'total_revenue' => 200.00, 'total_tickets' => 2],
            ['event_id' => 'evt-c', 'total_revenue' => 100.00, 'total_tickets' => 1],
        ];

        $this->repo
            ->shouldReceive('topEventsByRevenue')
            ->once()
            ->with('art-1', 10) // default limit = 10
            ->andReturn($fakeData);

        $result = $this->service->getTopEventsByRevenue('art-1');

        $this->assertCount(3, $result);
        $this->assertEquals('evt-a', $result[0]['event_id']); // primeiro = maior receita
        $this->assertEquals(300.00, $result[0]['total_revenue']);
    }

    public function test_get_top_events_passes_custom_limit_to_repository(): void {
        $this->repo
            ->shouldReceive('topEventsByRevenue')
            ->once()
            ->with('art-1', 5) // verifica que $limit chegou até o repo
            ->andReturn([]);

        $this->service->getTopEventsByRevenue('art-1', 5);

        $this->assertTrue(true);
    }

    public function test_get_top_events_returns_empty_array_when_no_sales(): void {
        $this->repo
            ->shouldReceive('topEventsByRevenue')
            ->andReturn([]);

        $result = $this->service->getTopEventsByRevenue('art-sem-vendas');

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }
}
