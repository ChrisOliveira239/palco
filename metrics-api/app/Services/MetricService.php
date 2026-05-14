<?php
namespace App\Services;

use App\Repositories\MetricRepository;

class MetricService {
    public function __construct(private MetricRepository $repo) {}

    public function recordSale(array $payload): array {
        return $this->repo->create([
            'event_id' => $payload['event_id'],
            'artist_id' => $payload['artist_id'],
            'ticket_id' => $payload['ticket_id'],
            'amount' => $payload['amount'],
            'type' => 'sale',
        ])->toArray();
    }

    public function getSummaryByArtist(string $artistId): array {
        $sales = $this->repo->revenueByArtist($artistId);

        return [
            'artist_id' => $artistId,
            'total_revenue' => $sales->sum('amount'),
            'total_tickets' => $sales->count(),
        ];
    }
}
