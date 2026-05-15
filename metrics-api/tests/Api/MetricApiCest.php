<?php
namespace Tests\Api;
use Tests\ApiTester;

class MetricApiCest {
    const URL_METRICS = '/api/metrics';

    public function _before(ApiTester $I): void {
        $I->haveHttpHeader('Accept', 'application/json');
    }

    // --- POST /api/metrics ---

    public function store_valid_metric_returns_201(ApiTester $I): void {
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-test-1',
            'artist_id' => 'art-test-1',
            'ticket_id' => 'tkt-test-1',
            'amount' => 75.50,
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'artist_id' => 'art-test-1',
            'amount' => 75.50,
            'type' => 'sale',
        ]);
    }

    public function store_without_required_fields_returns_422(ApiTester $I): void {
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-test-2',
            // faltam artist_id, ticket_id, amount
        ]);

        $I->seeResponseCodeIs(422);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'errors' => [
                'artist_id' => [],
                'ticket_id' => [],
                'amount' => [],
            ],
        ]);
    }

    public function store_with_non_numeric_amount_returns_422(ApiTester $I): void {
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-test-3',
            'artist_id' => 'art-test-3',
            'ticket_id' => 'tkt-test-3',
            'amount' => 'nao-e-numero',
        ]);

        $I->seeResponseCodeIs(422);
    }

    // --- GET /api/metrics/artist/{id} ---

    public function summary_returns_correct_aggregation(ApiTester $I): void {
        $artistId = 'art-summary-' . uniqid();

        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-4',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-4a',
            'amount' => 100.00,
        ]);
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-4',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-4b',
            'amount' => 50.00,
        ]);

        $I->sendGet(self::URL_METRICS . '/artist/' . $artistId);

        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'artist_id' => $artistId,
            'total_revenue' => 150.00,
            'total_tickets' => 2,
        ]);
    }

    public function summary_for_artist_without_sales_returns_zeros(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/artist/art-inexistente');

        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'total_revenue' => 0,
            'total_tickets' => 0,
        ]);
    }

    public function sales_by_month_returns_grouped_data(ApiTester $I): void {
        $artistId = 'art-month-' . uniqid();

        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-month-1',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-m1',
            'amount' => 100.00,
        ]);
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-month-2',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-m2',
            'amount' => 50.00,
        ]);

        $I->sendGet(self::URL_METRICS . '/' . $artistId . '/sales-by-month');

        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();

        $I->seeResponseContainsJson([
            ['total_revenue' => 150.00, 'total_tickets' => 2],
        ]);
    }

    public function sales_by_month_for_artist_without_sales_returns_empty_array(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/art-inexistente-month/sales-by-month');

        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseEquals('[]');
    }

    public function top_events_returns_sorted_by_revenue(ApiTester $I): void {
        $artistId = 'art-top-' . uniqid();

        $I->sendPost(self::URL_METRICS, ['event_id' => 'evt-top-a', 'artist_id' => $artistId, 'ticket_id' => 'tkt-1', 'amount' => 300.00]);
        $I->sendPost(self::URL_METRICS, ['event_id' => 'evt-top-b', 'artist_id' => $artistId, 'ticket_id' => 'tkt-2', 'amount' => 100.00]);
        $I->sendPost(self::URL_METRICS, ['event_id' => 'evt-top-c', 'artist_id' => $artistId, 'ticket_id' => 'tkt-3', 'amount' => 200.00]);

        $I->sendGet(self::URL_METRICS . '/' . $artistId . '/top-events');
        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();

        $I->seeResponseContainsJson([
            ['event_id' => 'evt-top-a', 'total_revenue' => 300.00, 'total_tickets' => 1],
            ['event_id' => 'evt-top-c', 'total_revenue' => 200.00, 'total_tickets' => 1],
            ['event_id' => 'evt-top-b', 'total_revenue' => 100.00, 'total_tickets' => 1],
        ]);
    }

    public function top_events_for_artists_without_sales_returns_empty_array(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/art-inexistente-top/top-events');
        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseEquals('[]');
    }

    public function revenue_by_period_returns_grouped_data(ApiTester $I): void {
        $artistId = 'art-period-' . uniqid();

        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-p1', 'artist_id' => $artistId,
            'ticket_id' => 'tkt-p1', 'amount' => 100.00,
        ]);
        $I->sendPost(self::URL_METRICS, [
            'event_id' => 'evt-p1', 'artist_id' => $artistId,
            'ticket_id' => 'tkt-p2', 'amount' => 50.00,
        ]);

        $I->sendGet(self::URL_METRICS . '/' . $artistId . '/revenue-by-period', [
            'from' => date('Y-m'),
            'to' => date('Y-m'),
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            ['total_revenue' => 150.00, 'total_tickets' => 2],
        ]);
    }

    public function revenue_by_period_missing_params_returns_422(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/art-1/revenue-by-period');

        $I->seeResponseCodeIs(422);
        $I->seeResponseContainsJson([
            'errors' => ['from' => [], 'to' => []],
        ]);
    }

    public function revenue_by_period_invalid_format_returns_422(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/art-1/revenue-by-period', [
            'from' => '01-2025', // formato errado
            'to' => '03-2025',
        ]);

        $I->seeResponseCodeIs(422);
    }

    public function revenue_by_period_returns_empty_outside_range(ApiTester $I): void {
        $I->sendGet(self::URL_METRICS . '/art-inexistente-period/revenue-by-period', [
            'from' => '2020-01',
            'to' => '2020-03',
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeResponseEquals('[]');
    }

}
