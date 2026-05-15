<?php
namespace App\Http\Controllers;

use App\Services\MetricService;
use Illuminate\Http\Request;

class MetricController extends Controller {
    public function __construct(private MetricService $service) {}

    public function store(Request $request) {
        $data = $request->validate([
            'event_id' => 'required|string',
            'artist_id' => 'required|string',
            'ticket_id' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        return response()->json($this->service->recordSale($data), 201);
    }

    public function summary(string $artistId) {
        return response()->json($this->service->getSummaryByArtist($artistId));
    }

    public function salesByMonth(string $artistId) {
        return response()->json($this->service->getSalesByMonth($artistId));
    }

    public function topEvents(string $artistId) {
        return response()->json($this->service->getTopEventsByRevenue($artistId));
    }
}
