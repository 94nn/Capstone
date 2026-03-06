<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/modules', function () {
    return DB::table('modules')->get();
});

Route::get('/modules/{slug}', function ($slug) {
    return DB::table('chapters')
        ->join('modules', 'chapters.module_id', '=', 'modules.id')
        ->where('modules.slug', $slug)
        ->orderBy('chapters.chapter_order')
        ->select(
            'chapters.*',
            'modules.title as module_title'
        )
        ->get();
});

Route::get('/modules/{slug}/{chapter_id}', function ($slug, $chapter_id) {
    return DB::table('subchapters')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('chapter_id', $chapter_id)
        ->orderBy('subchapter_order')
        ->select(
            'subchapters.*',
            'chapters.chapter_order as chapter_order',
            'chapters.title as chapter_title'
        )
        ->get();
});

Route::get('/subchapters/{subchapter_id}/quiz', function ($subchapter_id) {
    return DB::table('quizzes')
        ->where('subchapter_id', $subchapter_id)
        ->first();
});