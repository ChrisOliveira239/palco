<?php
namespace App\Repositories;

use App\Models\Metric;

class MetricRepository {
    public function create(array $data): Metric {
        return Metric::create($data);
    }

    public function revenueByArtist(string $artistId): \Illuminate\Database\Eloquent\Collection {
        return Metric::where('artist_id', $artistId)
            ->where('type', 'sale')
            ->get(['amount', 'event_id']);
    }

    public function ticketsByEvent(string $eventId): int {
        return Metric::where('event_id', $eventId)
            ->where('type', 'sale')
            ->count();
    }
}
