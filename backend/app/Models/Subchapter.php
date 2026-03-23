<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subchapter extends Model
{
    use HasFactory;

    protected $table = 'subchapters';
    protected $fillable = ['chapter_id', 'title', 'description', 'subchapter_order', 'passing_score', 'created_at'];
}