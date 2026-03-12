<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EditModule;

class ModuleController extends Controller
{
    // 返回模块 + 章节 + 子章节
    public function indexWithDetails()
    {
        // 使用 Eloquent 关联
        $modules = EditModule::with(['chapters.subchapters'])->get();

        return response()->json($modules);
    }

    // 创建模块
    public function store(Request $request)
    {
        $module = EditModule::create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => \Illuminate\Support\Str::slug($request->name)
        ]);

        return response()->json($module);
    }

    // 删除模块
    public function destroy($id)
    {
        $module = EditModule::find($id);
        if (!$module) {
            return response()->json(['error' => 'Module not found'], 404);
        }

        $module->delete();
        return response()->json(['message' => 'Module deleted successfully']);
    }
public function index() {
    $modules = EditModule::with('chapters.subchapters')->get();
    return response()->json($modules);
}

    // 更新模块
    public function update(Request $request, $id)
    {
        $module = EditModule::find($id);
        if (!$module) {
            return response()->json(['error' => 'Module not found'], 404);
        }

        $module->update([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => \Illuminate\Support\Str::slug($request->name)
        ]);

        return response()->json($module);
    }
}