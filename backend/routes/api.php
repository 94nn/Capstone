<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Student;

//Modules
Route::get('/modules', function () {
    return DB::table('modules')->get();
});

//Chapters
Route::get('/modules/{slug}', function ($slug) {
    return DB::table('chapters')
        ->join('modules', 'chapters.module_id', '=', 'modules.id')
        ->where('modules.slug', $slug)
        ->orderBy('chapters.level')
        ->select(
            'chapters.*',
            'modules.name as module_name'
        )
        ->get();
});

//Subchapters
Route::get('/modules/{slug}/{chapter_id}', function ($slug, $chapter_id) {
    return DB::table('subchapters')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('chapter_id', $chapter_id)
        ->orderBy('subchapter_order')
        ->select(
            'subchapters.*',
            'chapters.level as chapter_level',
            'chapters.title as chapter_title'
        )
        ->get();
});

//Quizzes
Route::get('/modules/{slug}/{chapter_id}/{subchapter_id}', function ($slug, $chapter_id, $subchapter_id) {
    $quizzes = DB::table('quizzes')
        ->join('subchapters', 'quizzes.subchapter_id', '=', 'subchapters.id')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->join('modules', 'chapters.module_id', '=', 'modules.id')
        ->where('modules.slug', $slug)
        ->where('chapters.id', $chapter_id)
        ->where('subchapters.id', $subchapter_id)
        ->orderBy('quizzes.id')
        ->select(
            'quizzes.*',
            'subchapters.id as subchapter_id',
            'subchapters.subchapter_order as subchapter_order',
            'subchapters.title as subchapter_title',
            'chapters.level as chapter_level',
            'chapters.title as chapter_title'
        )
        ->get();

    foreach ($quizzes as $quiz) {
        $quiz->options = DB::table('quiz_options')
            ->where('quiz_id', $quiz->id)
            ->orderBy('id')
            ->select('quiz_options.*')
            ->get();
    }

    return $quizzes;
});

Route::post('/quiz/check', function (Request $request) {
    $request->validate([
        'quiz_id' => 'required|integer',
        'option_id' => 'required|integer',
    ]);

    $option = DB::table('quiz_options')
        ->where('id', $request->option_id)
        ->where('quiz_id', $request->quiz_id)
        ->first();

    $quiz = DB::table('quizzes')
        ->where('id', $request->quiz_id)
        ->select('id', 'question', 'explanation')
        ->first();

    if (!$quiz || !$option) {
        return response()->json([
            'message' => 'Invalid quiz or option'
        ], 404);
    }

    $correctOption = DB::table('quiz_options')
        ->where('quiz_id', $request->quiz_id)
        ->where('is_correct', 1)
        ->select('id', 'option_text')
        ->first();

    return response()->json([
        'correct' => (bool) $option->is_correct,
        'selected_option_id' => (int) $option->id,
        'correct_option_id' => $correctOption?->id,
        'correct_option_text' => $correctOption?->option_text,
        'explanation' => $quiz->explanation,
    ]);
});

Route::get('/student/{id}', function($id) {
    $student = DB::table('student')->where('id', $id)->first();
    return response()->json([
        'username' => $student->name,
        'level' => $student->level,
        'xp' => $student->xp_balance,
        'badges' => $student->badges_balance,
        'image_url' => $student->profile_pic
    ]);
});

Route::get('/leaderboard', function() {
    $students = DB::table('student')
        ->orderBy('xp_balance', 'desc')
        ->limit(3)
        ->get();
        
    return response()->json($students);
});

Route::post('/progress/update', function (Request $request) {
    $request->validate([
        'student_id' => 'required|integer',
        'subchapter_id' => 'required|integer',
        'correct_answers' => 'required|integer',
        'total_questions' => 'required|integer',
        'passed' => 'required|boolean'
    ]);

    $status = $request->passed ? 'completed' : 'in_progress';

    DB::table('progress')->updateOrInsert(
        [
            'student_id' => $request->student_id,
            'subchapter_id' => $request->subchapter_id
        ],
        [
            'status' => $status,
            'correct_answers' => $request->correct_answers,
            'total_questions' => $request->total_questions,
            'score' => $request->correct_answers,
        ]
    );

    return response()->json([
        'message' => 'Progress updated'
    ]);
});

Route::get('/progress-summary/{student_id}/{slug}', function ($student_id, $slug) {
    $total = DB::table('chapters')
        ->join('modules', 'chapters.module_id', '=', 'modules.id')
        ->where('modules.slug', $slug)
        ->count();

    $completed = DB::table('chapters')
        ->join('modules', 'chapters.module_id', '=', 'modules.id')
        ->where('modules.slug', $slug)
        ->whereNotExists(function ($query) use ($student_id) {
            $query->select(DB::raw(1))
                ->from('subchapters')
                ->leftJoin('progress', function ($join) use ($student_id) {
                    $join->on('progress.subchapter_id', '=', 'subchapters.id')
                         ->where('progress.student_id', '=', $student_id);
                })
                ->whereColumn('subchapters.chapter_id', 'chapters.id')
                ->where(function ($q) {
                    $q->whereNull('progress.id')
                      ->orWhere('progress.status', '!=', 'completed');
                });
        })
        ->count();

    $percentage = $total > 0 ? round(($completed / $total) * 100, 2) : 0;

    return response()->json([
        'completed' => $completed,
        'total' => $total,
        'percentage' => $percentage
    ]);
});

Route::get('/progress/{student_id}/{chapter_id}', function ($student_id, $chapter_id) {
    $chapter = DB::table('chapters')
        ->where('id', $chapter_id)
        ->first();
        
    $total = DB::table('subchapters')
        ->where('chapter_id', $chapter_id)
        ->count();

    $completed = DB::table('progress')
        ->join('subchapters', 'progress.subchapter_id', '=', 'subchapters.id')
        ->where('progress.student_id', $student_id)
        ->where('progress.status', 'completed')
        ->where('subchapters.chapter_id', $chapter_id)
        ->count();

    $percentage = $total > 0 ? round(($completed / $total) * 100, 2) : 0;

    return response()->json([
        'level' => $chapter ? $chapter->level : null,
        'completed' => $completed,
        'total' => $total,
        'percentage' => $percentage
    ]);
});