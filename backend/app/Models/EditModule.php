<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditModule extends Model
{
    use HasFactory;

    protected $table = 'modules';
    protected $fillable = ['name', 'description', 'slug', 'created_at'];

    // module -> chapters

public function chapters() {
    return $this->hasMany(Chapter::class, 'module_id', 'id')
                ->with('subchapters'); // 直接加载子章节
}
}
