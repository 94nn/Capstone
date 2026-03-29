<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['id' => 1, 'name' => 'Linear Equation',        'image_path' => 'images/badges/RJvAnwOH9pkeIh2bjl2BweS7lfV7k7urIlyKafZU.png'],
            ['id' => 2, 'name' => 'Quadratic Equation',     'image_path' => 'images/badges/L0TMIOk6LvCS92AtWYvD6mBfdMHs9yplyJtSGwqH.png'],
            ['id' => 3, 'name' => 'Limits',                 'image_path' => 'images/badges/bBHnUHqVT67pVRwVWlm3RoUi2MzEbjP5nANLaMIC.png'],
            ['id' => 4, 'name' => 'Derivatives',            'image_path' => 'images/badges/xmVHwKH7jOCy7M2xAX5RVlObWkyEohuuA6H4ndnR.png'],
            ['id' => 5, 'name' => 'Probability',            'image_path' => 'images/badges/tWSXkVy8aBWpAoSg9HQVMPZuA06DyPQHaAOOOxQh.png'],
            ['id' => 6, 'name' => 'Probability Distribution','image_path' => 'images/badges/oLGpQyYlqYJ4rHlz2iN20yK5eBiSSrIIKH08Sbg2.png'],
            ['id' => 8, 'name' => 'badge 07',               'image_path' => 'images/badges/icUCm0ET7yDxynDqORVhaOoMFspHi1WaSkqMdJiJ.png'],
            ['id' => 9, 'name' => 'badge 08',               'image_path' => 'images/badges/ZZwqBnBwTlgbnKMPkQa8hZHk79NeFSmlvfDqHDfL.png'],
        ];

        foreach ($badges as $badge) {
            DB::table('badge')->updateOrInsert(
                ['id' => $badge['id']],
                ['name' => $badge['name'], 'image_path' => $badge['image_path']]
            );
        }
    }
}
