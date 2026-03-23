<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $table = 'chapters';
    protected $fillable = ['module_id', 'title', 'description', 'level', 'created_at'];

    // chapter -> subchapters
    public function subchapters() {
        return $this->hasMany(\App\Models\Subchapter::class, 'chapter_id', 'id')->orderBy('subchapter_order');
    }
}