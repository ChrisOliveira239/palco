<?php
namespace App\Repositories;

use App\Models\Metric;

class MetricRepository {
    public function create(array $data): Metric {
        $data['amount'] = (float) $data['amount'];

        return Metric::create($data);
    }

    public function revenueByArtist(string $artistId): array {
        $result = Metric::raw(function ($collection) use ($artistId) {
            return $collection->aggregate([
                ['$match' => [
                    'artist_id' => $artistId,
                    'type' => 'sale',
                ]],

                ['$group' => [
                    '_id' => '$artist_id',
                    'total_revenue' => ['$sum' => '$amount'],
                    'total_tickets' => ['$sum' => 1],
                ]],
            ]);
        });

        $items = iterator_to_array($result);

        if (empty($items)) {
            return [
                '_id' => $artistId,
                'total_revenue' => 0,
                'total_tickets' => 0,
            ];
        }

        return [
            '_id' => (string) $items[0]['_id'],
            'total_revenue' => (float) $items[0]['total_revenue'],
            'total_tickets' => (int) $items[0]['total_tickets'],
        ];
    }

    public function ticketsByEvent(string $eventId): int {
        return Metric::where('event_id', $eventId)
            ->where('type', 'sale')
            ->count();
    }

    public function salesByMonth(string $artistId): array {
        $result = Metric::raw(function ($collection) use ($artistId) {
            return $collection->aggregate([

                ['$match' => [
                    'artist_id' => $artistId,
                    'type' => 'sale',
                ]],

                ['$group' => [
                    '_id' => [
                        'year' => ['$year' => '$created_at'],
                        'month' => ['$month' => '$created_at'],
                    ],
                    'total_revenue' => ['$sum' => '$amount'],
                    'total_tickets' => ['$sum' => 1],
                ]],
                ['$sort' => [
                    '_id.year' => 1,
                    '_id.month' => 1,
                ]],
            ]);
        });

        return iterator_to_array($result);
    }

    public function topEventsByRevenue(string $artistId, int $limit = 10): array {
        $result = Metric::raw(function ($collection) use ($artistId, $limit) {
            return $collection->aggregate([
                ['$match' => [
                    'artist_id' => $artistId,
                    'type' => 'sale',
                ]],
                ['$group' => [
                    '_id' => '$event_id',
                    'total_revenue' => ['$sum' => '$amount'],
                    'total_tickets' => ['$sum' => 1],
                ]],
                ['$sort' => ['total_revenue' => -1]],
                ['$limit' => $limit],
            ]);
        });

		$items = iterator_to_array($result, false);

		return array_map(fn($item) => [
			'event_id' 		=> (string) $item['_id'],
			'total_revenue' => (float) 	$item['total_revenue'],
			'total_tickets' => (int) 	$item['total_tickets']
		], $items);
    }

}
