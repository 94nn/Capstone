<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModuleController;

use Illuminate\Support\Facades\Storage;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Calculate level from XP and send level-up notification
function checkLevelUp($studentId) {
    $student = DB::table('student')->where('id', $studentId)->first();
    if (!$student) return;

    $newLevel = intdiv($student->xp_balance, 100);
    if ($newLevel > $student->level) {
        DB::table('student')->where('id', $studentId)->update(['level' => $newLevel]);
        DB::table('notification')->insert([
            'student_id' => $studentId,
            'title'      => 'Level Up!',
            'message'    => "Congratulations! You've reached Level {$newLevel}!",
            'is_read'    => 0,
            'created_at' => now(),
        ]);
    }
}
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\EditModule;
use Illuminate\Support\Str;

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

//Admin Modules
Route::get('/admin', function () {
    return DB::table('modules')->get();
});

Route::get('/admin/user/{id}', function ($id) {
    $admin = DB::table('admin')->where('id', $id)->first();
    if (!$admin) return response()->json(['error' => 'Admin not found'], 404);
    return response()->json($admin);
});

//add Admin modules function
Route::post('/admin', function (Request $request) {

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

//edit Admin modules function
Route::put('/admin/{id}', function (Request $request, $id) {
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
Route::delete('/admin/{id}', function ($id) {
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

    // 1. 找 module
    $module = DB::table('modules')->where('slug', $slug)->first();
    if (!$module) {
        return response()->json(['error' => 'Module not found'], 404);
    }

    // 2. 找 chapter（确保属于该 module）
    $chapter = DB::table('chapters')
        ->where('id', $id)
        ->where('module_id', $module->id)
        ->first();

    if (!$chapter) {
        return response()->json(['error' => 'Chapter not found'], 404);
    }

    $deletedLevel = $chapter->level;

    // 3. 删除
    DB::table('chapters')->where('id', $id)->delete();

    // 4. 补位
    DB::table('chapters')
        ->where('module_id', $module->id)
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
        'subchapter_order' => $nextOrder,  
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

//delete subchapter
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

// create Quiz
Route::post('/modules/{slug}/{chapter_id}/{subchapter_id}/quiz', function (Request $request, $slug, $chapter_id, $subchapter_id) {

    // 插入 quiz
    $quizId = DB::table('quizzes')->insertGetId([
        'question' => $request->question,
        'explanation' => $request->explanation ?? '',
        'subchapter_id' => $subchapter_id
    ]);

    // 插入 options
    if ($request->options && is_array($request->options)) {
        foreach ($request->options as $opt) {
            DB::table('quiz_options')->insert([
                'quiz_id' => $quizId,
                'option_text' => $opt['option_text'] ?? '',
                'is_correct' => $opt['is_correct'] ?? false
            ]);
        }
    }

    return response()->json([
        'message' => 'Quiz created',
        'quiz_id' => $quizId
    ]);
});

//Edit quiz
Route::put('/modules/{slug}/{chapter_id}/{subchapter_id}/quiz/{quiz_id}', function (Request $request, $slug, $chapter_id, $subchapter_id, $quiz_id) {

    // 更新 quiz
    DB::table('quizzes')
        ->where('id', $quiz_id)
        ->update([
            'question' => $request->question,
            'explanation' => $request->explanation ?? ''
        ]);

    // 更新 options：先删再加
    DB::table('quiz_options')->where('quiz_id', $quiz_id)->delete();

    if ($request->options && is_array($request->options)) {
        foreach ($request->options as $opt) {
            DB::table('quiz_options')->insert([
                'quiz_id' => $quiz_id,
                'option_text' => $opt['option_text'] ?? '',
                'is_correct' => $opt['is_correct'] ?? false
            ]);
        }
    }

    return response()->json([
        'message' => 'Quiz updated',
        'quiz_id' => $quiz_id
    ]);
});

//Delete Quiz
Route::delete('/modules/{slug}/{chapter_id}/{subchapter_id}/quiz/{quiz_id}', function ($slug, $chapter_id, $subchapter_id, $quiz_id) {

    // 先删 options
    DB::table('quiz_options')->where('quiz_id', $quiz_id)->delete();

    // 再删 quiz
    DB::table('quizzes')->where('id', $quiz_id)->delete();

    return response()->json([
        'message' => 'Quiz deleted',
        'quiz_id' => $quiz_id
    ]);
});

// Student Analytics
Route::get('/student/{id}/analytics', function($id) {
    $moduleProgress = DB::table('progress')
        ->join('modules', 'progress.module_id', '=', 'modules.id')
        ->where('progress.student_id', $id)
        ->where('progress.progress', '>', 0)
        ->orderBy('progress.progress', 'desc')
        ->select('modules.name', 'modules.slug', 'progress.progress')
        ->get();

    $challengeStats = DB::table('student_challenge_completion')
        ->join('challenge', 'student_challenge_completion.challenge_id', '=', 'challenge.id')
        ->leftJoin('badge', 'student_challenge_completion.badge_id', '=', 'badge.id')
        ->where('student_challenge_completion.student_id', $id)
        ->orderBy('student_challenge_completion.completed_at', 'desc')
        ->select(
            'challenge.title',
            'student_challenge_completion.correct_answers',
            'student_challenge_completion.total_questions',
            'student_challenge_completion.completed_at',
            'badge.name as badge_name',
            'badge.image_path as badge_image'
        )
        ->get();

    return response()->json([
        'module_progress' => $moduleProgress,
        'challenge_stats' => $challengeStats,
    ]);
});

//Home Page Student
Route::get('/student/{id}', function($id) {
    $student = DB::table('student')->where('id', $id)->first();
    $badges = DB::table('student_challenge_completion')->where('student_id', $id)->whereNotNull('badge_id')->distinct()->pluck('badge_id')->toArray();
    return response()->json([
        'username' => $student->name,
        'level' => $student->level,
        'xp' => $student->xp_balance,
        'badges' => count($badges),
        'coins' => $student->coins_balance,
        'image_url' => $student->profile_pic,
        'bio' => $student->Bio,
        'email' => $student->email,
        'badges_list' => $badges
    ]);
});

Route::get('/profile/badges', function() {
    $badges = DB::table('badge')
        ->join('challenge', 'badge.id', '=', 'challenge.badge_id')
        ->select('badge.*')
        ->distinct()
        ->get();

    return response()->json($badges);
});

// Leaderboard Page Leaderboard
Route::get('/leaderboard/all', function() {
    $students = DB::table('student')
        ->orderBy('xp_balance', 'desc')
        ->get();
    return response()->json($students);
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

Route::post('/progress/update', function(Request $request) {

    $request->validate([
        'student_id' => 'required|integer',
        'subchapter_id' => 'required|integer',
        'correct_answers' => 'required|integer',
        'total_questions' => 'required|integer',
        'passed' => 'required|boolean'
    ]);

    $studentId = $request->student_id;
    $subchapterId = $request->subchapter_id;
    $newCorrectAnswers = $request->correct_answers;
    $totalQuestions = $request->total_questions;
    $passed = $request->passed;

    $existingProgress = DB::table('subchapter_progress')
        ->where('student_id', $studentId)
        ->where('subchapter_id', $subchapterId)
        ->first();

    if ($existingProgress) {
        $bestCorrectAnswers = max($existingProgress->correct_answers, $newCorrectAnswers);

        // Once completed, always completed
        $finalStatus = ($existingProgress->status === 'completed' || $passed)
            ? 'completed'
            : 'not_started';

        DB::table('subchapter_progress')
            ->where('id', $existingProgress->id)
            ->update([
                'status' => $finalStatus,
                'correct_answers' => $bestCorrectAnswers,
                'total_questions' => $totalQuestions
            ]);

        // Reward only first time completed
        if ($existingProgress->status !== 'completed' && $passed) {
            DB::table('student')
                ->where('id', $studentId)
                ->increment('xp_balance', 50);

            DB::table('student')
                ->where('id', $studentId)
                ->increment('coins_balance', 10);

            checkLevelUp($studentId);
        }

    } else {
        $status = $passed ? 'completed' : 'not_started';

        DB::table('subchapter_progress')->insert([
            'student_id' => $studentId,
            'subchapter_id' => $subchapterId,
            'status' => $status,
            'correct_answers' => $newCorrectAnswers,
            'total_questions' => $totalQuestions
        ]);

        if ($passed) {
            DB::table('student')
                ->where('id', $studentId)
                ->increment('xp_balance', 50);

            DB::table('student')
                ->where('id', $studentId)
                ->increment('coins_balance', 10);

            checkLevelUp($studentId);
        }
    }

    $module = DB::table('subchapters')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('subchapters.id', $subchapterId)
        ->select('chapters.module_id')
        ->first();

    if (!$module) {
        return response()->json(['message' => 'Module not found'], 404);
    }

    $total = DB::table('subchapters')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('chapters.module_id', $module->module_id)
        ->count();

    $completed = DB::table('subchapter_progress')
        ->join('subchapters', 'subchapter_progress.subchapter_id', '=', 'subchapters.id')
        ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
        ->where('subchapter_progress.student_id', $studentId)
        ->where('chapters.module_id', $module->module_id)
        ->where('subchapter_progress.status', 'completed')
        ->count();

    $percentage = $total > 0 ? round(($completed / $total) * 100, 2) : 0;

    DB::table('progress')->updateOrInsert(
        [
            'student_id' => $studentId,
            'module_id' => $module->module_id
        ],
        [
            'completed' => $completed,
            'progress' => $percentage
        ]
    );

    // Notify when a subchapter exercise is completed
    if ($passed) {
        $subchapterInfo = DB::table('subchapters')
            ->join('chapters', 'subchapters.chapter_id', '=', 'chapters.id')
            ->join('modules', 'chapters.module_id', '=', 'modules.id')
            ->where('subchapters.id', $subchapterId)
            ->select('subchapters.title as subchapter_title', 'subchapters.subchapter_order', 'chapters.title as chapter_title', 'modules.name as module_name')
            ->first();

        if ($subchapterInfo) {
            $exerciseNum = $subchapterInfo->subchapter_order;
            DB::table('notification')->insert([
                'student_id' => $studentId,
                'title'      => 'Exercise Completed!',
                'message'    => "You've completed Exercise {$exerciseNum} ({$subchapterInfo->subchapter_title}) from {$subchapterInfo->module_name} - {$subchapterInfo->chapter_title}!",
                'is_read'    => 0,
                'created_at' => now(),
            ]);
        }
    }

    return response()->json([
        'message' => 'Progress updated',
        'student_id' => $studentId,
        'subchapter_id' => $subchapterId,
        'passed' => $passed,
        'module_id' => $module->module_id,
        'completed' => $completed,
        'total' => $total,
        'percentage' => $percentage
    ]);
});

Route::get('/progress-summary/{student_id}/{slug}', function($student_id, $slug) {

    $module = DB::table('modules')
        ->where('slug', $slug)
        ->first();

    if (!$module) {
        return response()->json([
            'message' => 'Module not found'
        ], 404);
    }

    $total = DB::table('subchapters')
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

Route::get('/subchapter_progress/{student_id}/{chapter_id}', function($student_id, $chapter_id) { 
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

Route::get('/subchapter_progress/{student_id}/{chapter_id}/{subchapter_id}', function($student_id, $chapter_id, $subchapter_id) { 

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

Route::get('/hint/{quiz_id}', function($quiz_id) {
    $hints = DB::table('hint')
        ->where('quiz_id', $quiz_id)
        ->get();

    return response()->json($hints);
});

Route::get('/hint/unlocked/{student_id}/{quiz_id}', function($student_id, $quiz_id) {
    $unlockedHints = DB::table('hint_unlock')
        ->join('hint', 'hint_unlock.hint_id', '=', 'hint.id')
        ->where('hint_unlock.student_id', $student_id)
        ->where('hint.quiz_id', $quiz_id)
        ->select('hint.id', 'hint.content')
        ->get();

    return response()->json($unlockedHints);
});

Route::post('/hint/unlock', function (Request $request) {
    $request->validate([
        'student_id' => 'required|integer',
        'hint_id' => 'required|integer',
    ]);

    $student = DB::table('student')->where('id', $request->student_id)->first();
    $hint = DB::table('hint')->where('id', $request->hint_id)->first();

    if (!$student) {
        return response()->json(['error' => 'Student not found'], 404);
    }

    if (!$hint) {
        return response()->json(['error' => 'Hint not found'], 404);
    }

    $alreadyUnlocked = DB::table('hint_unlock')
        ->where('student_id', $request->student_id)
        ->where('hint_id', $request->hint_id)
        ->exists();

    if ($alreadyUnlocked) {
        return response()->json([
            'content' => $hint->content,
            'coins_balance' => $student->coins_balance,
            'message' => 'Hint already unlocked'
        ]);
    }

    if ($hint->type === 'free') {
        DB::table('hint_unlock')->insert([
            'student_id' => $request->student_id,
            'hint_id' => $request->hint_id,
        ]);

        return response()->json([
            'content' => $hint->content,
            'coins_balance' => $student->coins_balance,
            'message' => 'Free hint unlocked successfully'
        ]);
    }

    $price = $hint->price ?? 0;

    if ($student->coins_balance < $price) {
        return response()->json([
            'error' => 'Not enough coins'
        ], 400);
    }

    DB::beginTransaction();

    try {
        $newBalance = $student->coins_balance - $price;

        DB::table('student')
            ->where('id', $request->student_id)
            ->update([
                'coins_balance' => $newBalance
            ]);

        DB::table('hint_unlock')->insert([
            'student_id' => $request->student_id,
            'hint_id' => $request->hint_id,
        ]);

        DB::commit();

        return response()->json([
            'content' => $hint->content,
            'coins_balance' => $newBalance,
            'message' => 'Hint unlocked successfully'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'error' => 'Failed to unlock hint'
        ], 500);
    }
});

// GET all  
Route::get('/challenge', function () {
    $challenges = DB::table('challenge')
        ->join('modules', 'challenge.module_id', '=', 'modules.id')
        ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
        ->select(
            'challenge.id',
            'chapters.title as title',
            'challenge.slug',
            'challenge.xp_quantity',
            'challenge.badge_id',
            'challenge.coins_quantity',
            'modules.name as topic',
            DB::raw('(SELECT COUNT(*) FROM challenge_question WHERE challenge_question.challenge_id = challenge.id) as num_challenges'),
            DB::raw('challenge.xp_quantity * (SELECT COUNT(*) FROM challenge_question WHERE challenge_question.challenge_id = challenge.id) as total_xp'),
            DB::raw('challenge.coins_quantity * (SELECT COUNT(*) FROM challenge_question WHERE challenge_question.challenge_id = challenge.id) as total_coins')
        )
        ->get();
    return response()->json($challenges);
});

// GET challenges by module — MUST be before /challenge/{slug}
Route::get('/challenge/module/{module_id}', function ($module_id) {
    return response()->json(
        DB::table('challenge')
            ->join('modules', 'challenge.module_id', '=', 'modules.id')
            ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
            ->where('challenge.module_id', $module_id)
            ->select(
                'challenge.id',
                'chapters.title as title',
                'challenge.description',
                'challenge.slug',
                'challenge.xp_quantity',
                'challenge.badge_id',
                'challenge.coins_quantity',
                'modules.id as module_id',
                'modules.name as module_name'
            )
            ->get()
    );
});

// GET single challenge by slug — wildcard, must be LAST
Route::get('/challenge/{slug}', function ($slug) {
    $challenge = DB::table('challenge')
        ->join('modules', 'challenge.module_id', '=', 'modules.id')
        ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
        ->leftJoin('badge', 'challenge.badge_id', '=', 'badge.id')
        ->where('challenge.slug', $slug)
        ->select(
            'challenge.id',
            'chapters.title as title',
            'challenge.title as challenge_title',
            'challenge.description',
            'challenge.content',
            'challenge.slug',
            'challenge.xp_quantity',
            'challenge.badge_id',
            'badge.name as badge_name',
            'badge.image_path as badge_image',
            'challenge.coins_quantity',
            'modules.name as topic'
        )
        ->first();

    if (!$challenge) return response()->json(['message' => 'Challenge not found'], 404);

    $questions = DB::table('challenge_question')
        ->where('challenge_id', $challenge->id)
        ->get();

    foreach ($questions as $question) {
        $question->options = DB::table('challenge_options')
            ->where('c_question_id', $question->id)
            ->get();
    }

    $challenge->questions = $questions;

    return response()->json($challenge);
});

// Save challenge completion
Route::post('/challenge-completion', function (Request $request) {
    $student_id   = $request->student_id;
    $challenge_id = $request->challenge_id;
    $xp_earned    = $request->xp_earned;
    $coins_earned = $request->coins_earned;
    $badge_id     = $request->badge_id;

    $existing = DB::table('student_challenge_completion')
        ->where('student_id', $student_id)
        ->where('challenge_id', $challenge_id)
        ->first();

    if ($existing) {
        // Re-completion: award the difference if student improved
        $xp_diff    = $xp_earned - $existing->xp_earned;
        $coins_diff = $coins_earned - $existing->coins_earned;
        $new_badge  = $badge_id && !$existing->badge_id;

        DB::table('student_challenge_completion')
            ->where('id', $existing->id)
            ->update([
                'correct_answers' => $request->correct_answers,
                'total_questions' => $request->total_questions,
                'xp_earned'       => $xp_earned,
                'coins_earned'    => $coins_earned,
                'badge_id'        => $badge_id,
                'completed_at'    => now(),
            ]);

        if ($xp_diff > 0 || $coins_diff > 0 || $new_badge) {
            DB::table('student')
                ->where('id', $student_id)
                ->update([
                    'xp_balance'     => DB::raw("xp_balance + " . max($xp_diff, 0)),
                    'coins_balance'  => DB::raw("coins_balance + " . max($coins_diff, 0)),
                    'badges_balance' => DB::raw("badges_balance + " . ($new_badge ? 1 : 0)),
                ]);

            if ($new_badge) {
                $badge = DB::table('badge')->where('id', $badge_id)->first();
                $challengeTitle = DB::table('challenge')->where('id', $challenge_id)->value('title');
                if ($badge) {
                    DB::table('notification')->insert([
                        'student_id' => $student_id,
                        'title'      => 'Badge Earned!',
                        'message'    => "You earned the \"{$badge->name}\" badge for completing the {$challengeTitle} challenge!",
                        'image_url'  => $badge->image_path,
                        'is_read'    => 0,
                        'created_at' => now(),
                    ]);
                }
            }

            checkLevelUp($student_id);
        }
    } else {
        // First completion: insert record and add rewards to student balances
        DB::table('student_challenge_completion')->insert([
            'student_id'      => $student_id,
            'challenge_id'    => $challenge_id,
            'correct_answers' => $request->correct_answers,
            'total_questions' => $request->total_questions,
            'xp_earned'       => $xp_earned,
            'coins_earned'    => $coins_earned,
            'badge_id'        => $badge_id,
            'completed_at'    => now(),
        ]);

        DB::table('student')
            ->where('id', $student_id)
            ->update([
                'xp_balance'     => DB::raw("xp_balance + {$xp_earned}"),
                'coins_balance'  => DB::raw("coins_balance + {$coins_earned}"),
                'badges_balance' => DB::raw("badges_balance + " . ($badge_id ? 1 : 0)),
            ]);

        $challengeTitle = DB::table('challenge')->where('id', $challenge_id)->value('title');
        DB::table('notification')->insert([
            'student_id' => $student_id,
            'title'      => 'Challenge Completed!',
            'message'    => "You've completed the {$challengeTitle} challenge! You earned {$xp_earned} XP and {$coins_earned} coins.",
            'is_read'    => 0,
            'created_at' => now(),
        ]);

        if ($badge_id) {
            $badge = DB::table('badge')->where('id', $badge_id)->first();
            if ($badge) {
                DB::table('notification')->insert([
                    'student_id' => $student_id,
                    'title'      => 'Badge Earned!',
                    'message'    => "You earned the \"{$badge->name}\" badge for completing the {$challengeTitle} challenge!",
                    'image_url'  => $badge->image_path,
                    'is_read'    => 0,
                    'created_at' => now(),
                ]);
            }
        }

        checkLevelUp($student_id);
    }

    return response()->json(['success' => true]);
});

// Get all challenge completions for a student
Route::get('/challenge-completion/{student_id}', function ($student_id) {
    $completions = DB::table('student_challenge_completion')
        ->where('student_id', $student_id)
        ->get()
        ->keyBy('challenge_id');
    return response()->json($completions);
});

Route::post('/modules', [ModuleController::class, 'store']);
Route::put('/modules/{id}', [ModuleController::class, 'update']);
Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);
Route::get('/modules/details', [ModuleController::class, 'indexWithDetails']);  

// feedback
Route::get('/feedback', function () {
    $feedbacks = DB::table('feedback')
        ->join('student', 'feedback.student_id', '=', 'student.id')
        ->join('modules', 'feedback.module_id', '=', 'modules.id')
        ->select(
            'feedback.id',
            'feedback.feedback',
            'feedback.student_id',
            'feedback.module_id',
            'student.name as student_name',
            'modules.name as module_name'
        )
        ->get();

    return response()->json($feedbacks);
});

//check by id
Route::get('/feedback/{id}', function($id) {
    $feedback = DB::table('feedback')->where('id', $id)->first();
    if (!$feedback) return response()->json(['error' => 'Feedback not found'], 404);
    return response()->json($feedback);
});

//by student or module
Route::get('/feedback/student/{student_id}', function($student_id) {
    $feedbacks = DB::table('feedback')->where('student_id', $student_id)->get();
    return response()->json($feedbacks);
});

Route::get('/feedback/module/{module_id}', function($module_id) {
    $feedbacks = DB::table('feedback')->where('module_id', $module_id)->get();
    return response()->json($feedbacks);
});

//create feedback
Route::post('/feedback', function(Request $request) {

    $request->validate([
        'feedback' => 'required|string',
        'subchapter_id' => 'required|integer', // 前端传 subchapter_id
    ]);

    // 根据 subchapter 查 module
    $subchapter = DB::table('subchapters')->where('id', $request->subchapter_id)->first();
    if (!$subchapter) {
        return response()->json(['error' => 'Invalid subchapter'], 422);
    }

    $moduleId = DB::table('chapters')
        ->where('id', $subchapter->chapter_id)
        ->value('module_id');

    $id = DB::table('feedback')->insertGetId([
        'student_id' => $request->student_id,
        'feedback' => $request->feedback,
        'module_id' => $moduleId,
    ]);

    return response()->json(['success' => true, 'id' => $id]);
});
//edit feedback
Route::put('/feedback/{id}', function(Request $request, $id) {
    $request->validate([
        'feedback' => 'required|string',
    ]);

    $updated = DB::table('feedback')->where('id', $id)->update([
        'feedback' => $request->feedback,
    ]);


    if (!$updated) return response()->json(['error' => 'Feedback not found'], 404);
    return response()->json(['success' => true]);
});

//delete feedback
Route::delete('/feedback/{id}', function($id) {
    $deleted = DB::table('feedback')->where('id', $id)->delete();
    if (!$deleted) return response()->json(['error' => 'Feedback not found'], 404);
    return response()->json(['success' => true]);
});



// 获取所有 challenge
Route::get('/admin/challenge', function () {
    return DB::table('challenge')
        ->leftJoin('badge', 'challenge.badge_id', '=', 'badge.id')
        ->select(
            'challenge.*',
            'badge.name as badge_name',
            'badge.image_path as badge_image'
        )
        ->get();
});


// 获取单个 challenge + questions + options
Route::get('/admin/challenge/{id}', function($id) {
    $challenge = DB::table('challenge')
    ->leftJoin('badge', 'challenge.badge_id', '=', 'badge.id')
    ->where('challenge.id', $id)
    ->select(
        'challenge.*',
        'badge.name as badge_name',
        'badge.image_path as badge_image'
    )
    ->first();
});

Route::get('/admin/badge', function() {
    return DB::table('badge')->get();
});

// badge
Route::post('/admin/badge', function (Request $request) {

    // 验证
    $request->validate([
        'name' => 'required|string|max:255',
        'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $file = $request->file('image');
    $filename = time() . '_' . $file->getClientOriginalName();
    $file->move(public_path('images/badges'), $filename);
    $path = 'images/badges/' . $filename;

    // 存 DB
    $id = DB::table('badge')->insertGetId([
        'name' => $request->name,
        'image_path' => $path,
    ]);

    return response()->json([
        'message' => 'Badge created',
        'id' => $id,
        'image_path' => $path
    ]);
});

// 创建 challenge + 内部 questions + options
Route::post('/admin/challenge', function(Request $request) {
    DB::beginTransaction();
    try {
        $challengeId = DB::table('challenge')->insertGetId([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'badge_id' => $request->badge_id,
            'xp_quantity' => $request->xp_quantity ,
            'coins_quantity' => $request->coins_quantity ,
            'module_id' => $request->module_id,
            'chapter_id' => $request->chapter_id,
            'slug' => Str::slug($request->title),
        ]);

        foreach ($request->questions ?? [] as $q) {

            $questionId = DB::table('challenge_question')->insertGetId([
                'challenge_id' => $challengeId,
                'question' => $q['question'] ?? '',
                'explanation' => $q['explanation'] ?? null,
            ]);

            foreach ($q['options'] ?? [] as $opt) {
                DB::table('challenge_options')->insert([
                    'c_question_id' => $questionId,
                    'option_text' => $opt['option_text'] ?? '',
                    'is_correct' => $opt['is_correct'] ?? false,
                ]);
            }
        }

        DB::commit();
        return response()->json(['message' => 'Created', 'id' => $challengeId]);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Admin: 更新 challenge + 内部 questions + options
Route::put('/admin/challenge/{id}', function(Request $request, $id) {
    DB::beginTransaction();
    try {
        $moduleName = DB::table('modules')
            ->where('id', $request->module_id)
            ->value('name');

        $badgeId = $request->badge_id ?? null;

        // 更新 badge table
        if ($badgeId) {
            $badgeData = [];

            if ($request->filled('badge_name')) {
                $badgeData['name'] = $request->badge_name;
            }

            if ($request->hasFile('badge_image')) {
                $oldBadge = DB::table('badge')->where('id', $badgeId)->first();
                if ($oldBadge && $oldBadge->image_path && file_exists(public_path($oldBadge->image_path))) {
                    unlink(public_path($oldBadge->image_path));
                }
                $file = $request->file('badge_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/badges'), $filename);
                $badgeData['image_path'] = 'images/badges/' . $filename;
            }

            if (!empty($badgeData)) {
                DB::table('badge')->where('id', $badgeId)->update($badgeData);
            }
        }

        DB::table('challenge')->where('id', $id)->update([
            'title' => $request->title,
            'description' => $request->description ?? null,
            'content' => $request->content ?? null,
            'badge_id' => $badgeId,
            'xp_quantity' => $request->xp_quantity ?? 0,
            'coins_quantity' => $request->coins_quantity ?? 0,
            'module_id' => $request->module_id,
            'chapter_id' => $request->chapter_id,
            'slug' => Str::slug($moduleName . '-' . $request->title),
        ]);

        $questions = $request->questions;

        if (is_string($questions)) {
            $questions = json_decode($questions, true);
        }

        $questions = $questions ?? [];

        $questionIds = DB::table('challenge_question')
            ->where('challenge_id', $id)
            ->pluck('id');

        DB::table('challenge_options')
            ->whereIn('c_question_id', $questionIds)
            ->delete();

        DB::table('challenge_question')
            ->where('challenge_id', $id)
            ->delete();

        foreach ($questions as $q) {


            $questionId = DB::table('challenge_question')->insertGetId([
                'challenge_id' => $id,
                'question' => $q['question'] ?? '',
                'explanation' => $q['explanation'] ?? null,
            ]);

            foreach ($q['options'] ?? [] as $opt) {
                DB::table('challenge_options')->insert([
                    'c_question_id' => $questionId,
                    'option_text' => $opt['option_text'] ?? '',
                    'is_correct' => !empty($opt['is_correct']),
                ]);
            }
        }

        DB::commit();
        return response()->json(['message' => 'Updated']);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Admin: 删除 challenge + 内部 questions + options
Route::delete('/admin/challenge/{id}', function($id) {
    DB::beginTransaction();
    try {
        $questionIds = DB::table('challenge_question')->where('challenge_id', $id)->pluck('id');
        DB::table('challenge_options')->whereIn('c_question_id', $questionIds)->delete();
        DB::table('challenge_question')->where('challenge_id', $id)->delete();
        DB::table('student_challenge_completion')->where('challenge_id', $id)->delete();
        DB::table('challenge')->where('id', $id)->delete();
        DB::commit();
        return response()->json(['message' => 'Deleted']);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['error' => $e->getMessage()], 500);
    }
});



// 获取指定 module 下的 chapters
Route::get('api/modules/{module_id}/chapters', function($module_id) {
    $chapters = DB::table('chapters')
        ->where('module_id', $module_id)
        ->select('id', 'title') 
        ->get();
    
    return response()->json($chapters);
});


Route::post('/update-profile/{id}', function(Request $request, $id) {
    $role = $request->input('role');

    if ($role === 'admin') {
        $admin = DB::table('admin')->where('id', $id)->first();
        if (!$admin) return response()->json(['error' => 'Admin not found'], 404);

        $updateData = [];
        if ($request->filled('name')) $updateData['name'] = $request->input('name');
        if ($request->filled('bio')) $updateData['bio'] = $request->input('bio');

        if ($request->hasFile('profile_pic')) {
            $file = $request->file('profile_pic');
            if ($admin->image_url && file_exists(public_path($admin->image_url))) {
                unlink(public_path($admin->image_url));
            }
            $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                        . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('profile_pics'), $filename);
            $updateData['image_url'] = '/profile_pics/' . $filename;
        }

        DB::table('admin')->where('id', $id)->update($updateData);
        $updated = DB::table('admin')->where('id', $id)->first();

        return response()->json([
            'name' => $updated->name,
            'bio' => $updated->bio,
            'image_url' => $updated->image_url,
        ]);
    }

    $student = DB::table('student')->where('id', $id)->first();
    if (!$student) return response()->json(['error' => 'Student not found'], 404);

    $updateData = [];
    if ($request->filled('name')) $updateData['name'] = $request->input('name');
    if ($request->filled('bio')) $updateData['Bio'] = $request->input('bio');

    if ($request->hasFile('profile_pic')) {
        $file = $request->file('profile_pic');
        if ($student->profile_pic && file_exists(public_path($student->profile_pic))) {
            unlink(public_path($student->profile_pic));
        }
        $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                    . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('profile_pics'), $filename);
        $updateData['profile_pic'] = 'profile_pics/' . $filename;
    }

    DB::table('student')->where('id', $id)->update($updateData);
    $updatedStudent = DB::table('student')->where('id', $id)->first();

    return response()->json([
        'username' => $updatedStudent->name,
        'bio' => $updatedStudent->Bio,
        'image_url' => $updatedStudent->profile_pic ? url($updatedStudent->profile_pic) : null,
        'level' => $updatedStudent->level,
        'xp' => $updatedStudent->xp_balance,
        'badges' => $updatedStudent->badges_balance,
    ]);
});

Route::post('/verify-password/{id}', function(Request $request, $id) {
    $user = DB::table('student')->where('id', $id)->first();
    if (!$user) return response()->json(['valid' => false]);

    // Plain text password comparison
    if ($request->current_password === $user->password) {
        return response()->json(['valid' => true]);
    } else {
        return response()->json(['valid' => false]);
    }
});

Route::post('/update-settings/{id}', function(Request $request, $id) {
    $user = DB::table('student')->where('id', $id)->first();
    if (!$user) return response()->json(['error' => 'User not found'], 404);

    // Verify current password (plain-text)
    if ($request->filled('current_password') && $request->current_password !== $user->password) {
        return response()->json(['error' => 'Current password incorrect'], 400);
    }

    $updateData = [];

    // Update email if provided
    if ($request->filled('email')) {
        $updateData['email'] = $request->email;
    }

    // Update password only if new_password provided
    if ($request->filled('new_password')) {
        $updateData['password'] = $request->new_password;
    }

    if (!empty($updateData)) {
        DB::table('student')->where('id', $id)->update($updateData);
    }

    return response()->json(['success' => true, 'updated' => $updateData]);
});

Route::delete('/delete-account/{id}', function($id) {
    $user = DB::table('student')->where('id', $id)->first();
    if (!$user) return response()->json(['error' => 'User not found'], 404);

    DB::table('student')->where('id', $id)->delete();
    return response()->json(['success' => true]);
});

// Notifications
Route::get('/notifications/{user_id}', function($user_id) {
    $notifications = DB::table('notification')
        ->where('student_id', $user_id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($notifications);
});

Route::patch('/notifications/{id}/read', function($id) {
    $updated = DB::table('notification')->where('id', $id)->update(['is_read' => 1]);

    if (!$updated) return response()->json(['error' => 'Notification not found'], 404);

    return response()->json(['success' => true]);
});

Route::patch('/notifications/read-all/{user_id}', function($user_id) {
    DB::table('notification')->where('student_id', $user_id)->update(['is_read' => 1]);

    return response()->json(['success' => true]);
});