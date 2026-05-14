<?php
namespace Tests\Api;

use Tests\ApiTester;

class MetricApiCest {
    // Limpa collection antes de cada teste
    public function _before(ApiTester $I): void {
        $I->haveHttpHeader('Accept', 'application/json');
    }

    // --- POST /api/metrics ---

    public function store_valid_metric_returns_201(ApiTester $I): void {
        $I->sendPost('/api/metrics', [
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
        $I->sendPost('/api/metrics', [
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
        $I->sendPost('/api/metrics', [
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

        $I->sendPost('/api/metrics', [
            'event_id' => 'evt-4',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-4a',
            'amount' => 100.00,
        ]);
        $I->sendPost('/api/metrics', [
            'event_id' => 'evt-4',
            'artist_id' => $artistId,
            'ticket_id' => 'tkt-4b',
            'amount' => 50.00,
        ]);

        $I->sendGet('/api/metrics/artist/' . $artistId);

        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'artist_id' => $artistId,
            'total_revenue' => 150.00,
            'total_tickets' => 2,
        ]);
    }

    public function summary_for_artist_without_sales_returns_zeros(ApiTester $I): void {
        $I->sendGet('/api/metrics/artist/art-inexistente');

        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'total_revenue' => 0,
            'total_tickets' => 0,
        ]);
    }
}
