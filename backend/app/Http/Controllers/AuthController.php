<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Admin;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:student,email',
            'password' => 'required|min:6',
            'age' => 'required|integer',
        ]);

        $student = Student::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'age' => $request->age,
            'points_balance' => 0,
            'coins_balance' => 0,
        ]);

        return response()->json([
            'message' => 'Student registered successfully',
            'student' => $student
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)
            ->where('password', $request->password)
            ->first();
        
        if($admin) {
            return response()->json([
                'message' => 'Admin login successful',
                'role' => 'admin',
                'user' => $admin
            ], 200);
        }

        $student = Student::where('email', $request->email)
            ->where('password', $request->password)
            ->first();

        if ($student) {
            return response()->json([
                'message' => 'Student login successful',
                'role' => 'student',
                'user' => $student
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid email or password'
        ], 401);
    }
}