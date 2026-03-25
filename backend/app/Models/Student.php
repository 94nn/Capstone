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
        'date_of_birth',
        'xp_balance',
        'coins_balance',
        'badges_balance',
        'level',
        'profile_pic',
        'Bio',
    ];

    public $timestamps = false;
}