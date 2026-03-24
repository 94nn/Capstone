<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'student';

    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'xp_balance',
        'coins_balance',
        'badges_balance',
        'level',
        'profile_pic',
    ];

    public $timestamps = false;
}