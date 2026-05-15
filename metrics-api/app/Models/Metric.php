<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Metric extends Model {
    protected $connection = 'mongodb';
    protected $collection = 'metrics';
    protected $fillable   = ['event_id', 'artist_id', 'ticket_id', 'type', 'amount'];
    protected $indexes    = [
        'key' 	=> ['artist_id' => 1, 'type' => 1],
        'name' 	=> 'artist_type_idx',
    ];
}
