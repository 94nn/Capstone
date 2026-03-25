<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModuleController;

use Illuminate\Support\Facades\Storage;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
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

//Home Page Student
Route::get('/student/{id}', function($id) {
    $student = DB::table('student')->where('id', $id)->first();
    return response()->json([
        'username' => $student->name,
        'level' => $student->level,
        'xp' => $student->xp_balance,
        'badges' => $student->badges_balance,
        'image_url' => $student->profile_pic,
        'bio' => $student->Bio
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

Route::post('/hint/unlock', function (Request $request) {
    $student = DB::table('student')->where('id', $request->student_id)->first();
    $hint = DB::table('hint')->where('id', $request->hint_id)->first();

    if (!$student) {
        return response()->json(['error' => 'Student not found'], 404);
    }

    if (!$hint) {
        return response()->json(['error' => 'Hint not found'], 404);
    }

    if ($hint->type === 'free') {
        return response()->json([
            'content' => $hint->content,
            'coins_balance' => $student->coins_balance
        ]);
    }

    $price = $hint->price ?? 0;

    if ($student->coins_balance < $price) {
        return response()->json([
            'error' => 'Not enough coins'
        ], 400);
    }

    $newBalance = $student->coins_balance - $price;

    DB::table('student')
        ->where('id', $request->student_id)
        ->update([
            'coins_balance' => $newBalance
        ]);

    return response()->json([
        'content' => $hint->content,
        'coins_balance' => $newBalance,
        'message' => 'Hint unlocked successfully'
    ]);
});

Route::get('/challenge', function () {
    return DB::table('challenge')
        ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
        ->join('modules', 'challenge.module_id', '=', 'modules.id')
        ->select(
            'challenge.id',
            'challenge.title',
            'challenge.content',
            'challenge.slug',
            'challenge.badges',
            'modules.id as module_id',
            'modules.name as module_name',
            'chapters.title as chapter_title'
        )
        ->get();
});

Route::get('/challenge/module/{module_id}', function ($module_id) {
    return DB::table('challenge')
        ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
        ->join('modules', 'challenge.module_id', '=', 'modules.id')
        ->where('modules.id', $module_id)
        ->select(
            'challenge.id',
            'challenge.title',
            'challenge.content',
            'challenge.badges',
            'modules.id as module_id',
            'modules.name as module_name',
            'chapters.title as chapter_title'
        )
        ->get();
});

Route::get('/challenge/{slug}', function ($slug) {
    $challenge = DB::table('challenge')
        ->join('chapters', 'challenge.chapter_id', '=', 'chapters.id')
        ->join('modules', 'challenge.module_id', '=', 'modules.id')
        ->where('challenge.slug', $slug)
        ->select(
            'challenge.id',
            'challenge.title',
            'challenge.content',
            'challenge.badges',
            'challenge.slug',
            'modules.id as module_id',
            'modules.name as module_name',
            'chapters.title as chapter_title'
        )
        ->get(); 

    if (!$challenge) {
        return response()->json(['message' => 'Challenge not found'], 404);
    }

    return response()->json($challenge);
});

Route::post('/modules', [ModuleController::class, 'store']);
Route::put('/modules/{id}', [ModuleController::class, 'update']);
Route::delete('/modules/{id}', [ModuleController::class, 'destroy']);
Route::get('/modules/details', [ModuleController::class, 'indexWithDetails']);  

// feedback
Route::get('/feedback', function() {
    $feedbacks = DB::table('feedback')->get();
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
        'student_id' => 'required|integer',
        'feedback' => 'required|string',
        'module_id' => 'required|integer',
    ]);

    $id = DB::table('feedback')->insertGetId([
        'student_id' => $request->student_id,
        'feedback' => $request->feedback,
        'module_id' => $request->module_id,
        'created_at' => now(),
        'updated_at' => now()
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
        'updated_at' => now()
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

Route::post('/update-profile/{id}', function(Request $request, $id) {
    $student = DB::table('student')->where('id', $id)->first();

    if (!$student) {
        return response()->json(['error' => 'Student not found'], 404);
    }

    $updateData = [];

    // Update name and bio
    if ($request->filled('name')) $updateData['name'] = $request->input('name');
    if ($request->filled('bio')) $updateData['Bio'] = $request->input('bio');

    // Handle profile image upload
    if ($request->hasFile('profile_pic')) {
        $file = $request->file('profile_pic');

        // Delete old image if it exists
        if ($student->profile_pic && file_exists(public_path($student->profile_pic))) {
            unlink(public_path($student->profile_pic));
        }

        // Unique filename
        $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                    . '.' . $file->getClientOriginalExtension();

        // Move to public/profile_pics
        $file->move(public_path('profile_pics'), $filename);

        $updateData['profile_pic'] = 'profile_pics/' . $filename;
    }

    // Update DB
    DB::table('student')->where('id', $id)->update($updateData);

    $updatedStudent = DB::table('student')->where('id', $id)->first();

    return response()->json([
        'username' => $updatedStudent->name,
        'bio' => $updatedStudent->Bio,
        'image_url' => $updatedStudent->profile_pic
            ? url($updatedStudent->profile_pic)  // full URL
            : null,
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