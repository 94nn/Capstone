<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
use Illuminate\Http\Request;
use App\Models\Student;

//Modules
Route::get('/modules', function () {
    return DB::table('modules')->get();
});

//add modules function
Route::post('/modules', function (Request $request) {

    $slug = Str::slug($request->name);

    $id = DB::table('modules')->insertGetId([
        'name' => $request->name,
        'description' => $request->description,
        'slug' => $slug
    ]);

    return response()->json([
        'id' => $id,
        'name' => $request->name,
        'description' => $request->description,
        'slug' => $slug,
    ]);
});

//edit modules function
Route::put('/modules/{id}', function (Request $request, $id) {
    $slug = Str::slug($request->name); 

    // 处理重复
    $count = DB::table('modules')
        ->where('slug', 'LIKE', "$slug%")
        ->where('id', '!=', $id)
        ->count();

    if ($count > 0) {
        $slug = $slug . '-' . ($count + 1);
    }

    DB::table('modules')
        ->where('id', $id)
        ->update([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => $slug,
        ]);

    return response()->json([
        'message' => 'Updated successfully',
        'slug' => $slug
    ]);
});

//delete function
Route::delete('/modules/{id}', function ($id) {
    DB::table('modules')->where('id', $id)->delete();

    return response()->json([
        'message' => 'Deleted successfully'
    ]);
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

// add chapter 
Route::post('/modules/{slug}', function (Request $request, $slug) {

    // 用 slug 找 module_id
    $module = DB::table('modules')->where('slug', $slug)->first();

    if (!$module) {
        return response()->json(['error' => 'Module not found'], 404);
    }

    // 只算这个 module 的 level
    $maxLevel = DB::table('chapters')
        ->where('module_id', $module->id)
        ->max('level');

    $newLevel = $maxLevel ? $maxLevel + 1 : 1;

    $id = DB::table('chapters')->insertGetId([
        'title' => $request->title,
        'description' => $request->description,
        'module_id' => $module->id,
        'level' => $newLevel,   
    ]);

    return response()->json([
        'id' => $id,
        'title' => $request->title,
        'description' => $request->description,
        'level' => $newLevel,
    ]);
});

//edit chapter
Route::put('/modules/{slug}/{id}', function (Request $request, $slug, $id) {

    $chapter = DB::table('chapters')->where('id', $id)->first();

    if (!$chapter) {
        return response()->json(['error' => 'Chapter not found'], 404);
    }
    //level auto +1 
    $oldLevel = $chapter->level;
    $newLevel = $request->level;
    $moduleId = $chapter->module_id;


    if ($newLevel < $oldLevel) {
        DB::table('chapters')
            ->where('module_id', $moduleId)
            ->whereBetween('level', [$newLevel, $oldLevel - 1])
            ->increment('level');
    }

    if ($newLevel > $oldLevel) {
        DB::table('chapters')
            ->where('module_id', $moduleId)
            ->whereBetween('level', [$oldLevel + 1, $newLevel])
            ->decrement('level');
    }

    // 更新自己
    DB::table('chapters')
        ->where('id', $id)
        ->update([
            'title' => $request->title,
            'description' => $request->description,
            'level' => $newLevel,
        ]);

    return response()->json([
        'message' => 'Updated successfully',
    ]);
});



//delete chapter
Route::delete('/modules/{slug}/{id}', function ($slug, $id) {

    // 删除
    DB::table('chapters')->where('id', $id)->delete();
    $moduleId = $chapter->module_id;
    $deletedLevel = $chapter->level;

    // 后面的往前补
    DB::table('chapters')
        ->where('module_id', $moduleId)
        ->where('level', '>', $deletedLevel)
        ->decrement('level');

    return response()->json([
        'message' => 'Deleted successfully'
    ]);
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

//add Subchapters
Route::post('/modules/{slug}/{chapter_id}', function (Request $request,$slug, $chapter_id){
$maxOrder = DB::table('subchapters')
    ->where('chapter_id', $chapter_id)
    ->max('subchapter_order');
    $nextOrder = $maxOrder + 1;

    $id = DB::table('subchapters')->insertGetId([
        'title' => $request->title,
        'description' => $request->description,
        'chapter_id' => $chapter_id,
        'subchapter_order' => $nextOrder,   
    ]);

    return response()->json([
        'id' => $id,
        'title' => $request->title,
        'description' => $request->description,  
    ]);
});

//edit Subchapter
Route::put('/modules/{slug}/{chapter_id}/{id}', function (Request $request, $slug, $chapter_id, $id) {

    $subchapter = DB::table('subchapters')->where('id', $id)->first();

    if (!$subchapter) {
        return response()->json(['error' => 'SubChapter not found'], 404);
    }
    //level auto +1 
    $oldOrder = $subchapter->subchapter_order;
    $newOrder = $request->subchapter_order;
    $chapterId = $subchapter->chapter_id;


    if ($newOrder < $oldOrder) {
        DB::table('subchapters')
            ->where('chapter_id', $chapterId)
            ->whereBetween('subchapter_order', [$newOrder, $oldOrder - 1])
            ->increment('subchapter_order');
    }

    if ($newOrder > $oldOrder) {
        DB::table('subchapters')
            ->where('chapter_id', $chapterId)
            ->whereBetween('subchapter_order', [$oldOrder + 1, $newOrder])
            ->decrement('subchapter_order');
    }

    // 更新自己
    DB::table('subchapters')
        ->where('id', $id)
        ->update([
            'title' => $request->title,
            'description' => $request->description,
            'subchapter_order' => $newOrder,
        ]);

    return response()->json([
        'message' => 'Updated successfully',
    ]);
});

//delete chapter
Route::delete('/modules/{slug}/{chapter_id}/{id}', function ($slug, $chapter_id, $id) {

    $subchapter = DB::table('subchapters')->where('id', $id)->first();
    $chapterId = $subchapter->chapter_id;
    $deletedOrder = $subchapter->subchapter_order;
    
    // 删除
    DB::table('subchapters')->where('id', $id)->delete();


    // 后面的往前补
    DB::table('subchapters')
        ->where('chapter_id', $chapterId)
        ->where('subchapter_order', '>', $deletedOrder)
        ->decrement('subchapter_order');

    return response()->json([
        'message' => 'Deleted successfully'
    ]);
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

//Home Page Student
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


//Home Page Leaderboard
Route::get('/leaderboard', function() {
    $students = DB::table('student')
        ->orderBy('xp_balance', 'desc')
        ->limit(3)
        ->get();
        
    return response()->json($students);
});

//Home Page Progress
Route::get('/progress/{student_id}', function($student_id) {
    $progress = DB::table('progress')
        ->join('modules', 'progress.module_id', '=', 'modules.id')
        ->where('progress.student_id', $student_id)
        ->where('progress.progress', '<', 100)
        ->where('progress.progress', '>', 0)
        ->orderBy('progress.id', 'desc')
        ->select(
            'modules.name as course_title',
            'modules.slug as course_slug',
            'progress.progress as progress_percentage'
        )
        ->get();

    return response()->json($progress);
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

    DB::table('subchapter_progress')->updateOrInsert(
        [
            'student_id' => $request->student_id,
            'subchapter_id' => $request->subchapter_id
        ],
        [
            'status' => $status,
            'correct_answers' => $request->correct_answers,
            'total_questions' => $request->total_questions
        ]
    );

    $module = DB::table('subchapters')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('subchapters.id', $request->subchapter_id)
        ->select('chapters.module_id')
        ->first();

    if (!$module) {
        return response()->json(['message' => 'Module not found']);
    }

    $total = DB::table('quizzes')
        ->join('subchapters', 'quizzes.subchapter_id', '=', 'subchapters.id')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('chapters.module_id', $module->module_id)
        ->count();

    $completed = DB::table('subchapter_progress')
        ->join('subchapters', 'subchapter_progress.subchapter_id', '=', 'subchapters.id')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('subchapter_progress.student_id', $request->student_id)
        ->where('chapters.module_id', $module->module_id)
        ->sum('correct_answers');

    $percentage = $total > 0 ? round(($completed / $total) * 100, 2) : 0;

    DB::table('progress')->updateOrInsert(
        [
            'student_id' => $request->student_id,
            'module_id' => $module->module_id
        ],
        [
            'completed' => $completed,
            'progress' => $percentage
        ]
    );

    return response()->json([
        'message' => 'Progress updated'
    ]);
});

Route::get('/progress-summary/{student_id}/{slug}', function ($student_id, $slug) {

    $module = DB::table('modules')
        ->where('slug', $slug)
        ->first();

    if (!$module) {
        return response()->json([
            'message' => 'Module not found'
        ], 404);
    }

    $total = DB::table('quizzes')
        ->join('subchapters', 'quizzes.subchapter_id', '=', 'subchapters.id')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('chapters.module_id', $module->id)
        ->count();

    $progress = DB::table('progress')
        ->where('student_id', $student_id)
        ->where('module_id', $module->id)
        ->first();

    $completed = $progress ? $progress->completed : 0;
    $percentage = $progress ? $progress->progress : 0;

    return response()->json([
        'completed' => $completed,
        'total' => $total,
        'percentage' => $percentage
    ]);
});

Route::get('/subchapter_progress/{student_id}/{chapter_id}', function ($student_id, $chapter_id) { 
    $chapter = DB::table('chapters') 
        ->where('id', $chapter_id) 
        ->first(); 
        
    $total = DB::table('subchapters') 
        ->where('chapter_id', $chapter_id) 
        ->count(); 
        
    $completed = DB::table('subchapter_progress') 
        ->join('subchapters', 'subchapter_progress.subchapter_id', '=', 'subchapters.id') 
        ->where('subchapter_progress.student_id', $student_id) 
        ->where('subchapter_progress.status', 'completed') 
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

Route::get('/subchapter_progress/{student_id}/{chapter_id}/{subchapter_id}', function ($student_id, $chapter_id, $subchapter_id) { 

    $progress = DB::table('subchapter_progress')
        ->where('student_id', $student_id)
        ->where('subchapter_id', $subchapter_id)
        ->select('status')
        ->first();

    return response()->json([
        'status' => $progress ? $progress->status : null
    ]);
});

// Admin Team Route
Route::get('/team', function() {
    return DB::table('admin')->get();
});