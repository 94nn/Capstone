<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('attempt_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->string('type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_title')->nullable();
            $table->string('module_name')->nullable();
            $table->integer('correct_answers')->nullable();
            $table->integer('total_questions')->nullable();
            $table->boolean('passed')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('attempt_log');
    }
};
