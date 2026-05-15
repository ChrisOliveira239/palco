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
        $data = $this->repo->revenueByArtist($artistId);

        return [
            'artist_id' => $artistId,
            'total_revenue' => $data['total_revenue'],
            'total_tickets' => $data['total_tickets'],
        ];
    }

    public function getSalesByMonth(string $artistId): array {
        return $this->repo->salesByMonth($artistId);
    }

    public function getTopEventsByRevenue(string $artistId, int $limit = 10): array {
        return $this->repo->topEventsByRevenue($artistId, $limit);
    }

    public function getRevenueByPeriod(string $artistId, string $from, string $to): array {
        return $this->repo->revenueByPeriod($artistId, $from, $to);
    }
}
