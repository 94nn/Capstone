import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";

function LandingPage() {
    const navigate = useNavigate();

    return (
    <div className="min-h-screen bg-slate-950 text-white">
    <TopBar />

    {/* Hero Section */}
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
    {/* Left side */}
            <div>
                <p className="inline-block px-4 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm mb-5">
                    Gamified E-Learning Platform
                </p>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                    Learn Mathematics Through Challenges
                </h1>

                <p className="text-slate-300 text-lg leading-8 mb-8 max-w-2xl">
                    MathDex is a gamified math learning platform where students complete
                    challenges, earn badges, collect rewards, and climb the leaderboard.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button onClick={() => navigate("/register")}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 font-semibold shadow-lg shadow-sky-500/30 hover:scale-105 transition"
                    >
                        Get Started
                    </button>

                    <button onClick={() => navigate("/login")}
                        className="px-6 py-3 rounded-full border border-slate-500 text-white hover:bg-slate-800 transition"
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* Right side preview card */}
            <div className="bg-slate-900/80 border border-sky-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-900/20">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sky-400 font-medium">Level 1</span>
                    <span className="text-yellow-400 font-medium">120 XP</span>
                </div>

                <h2 className="text-2xl font-bold mb-3">Differentiation</h2>
                <p className="text-slate-300 mb-6">
                Study lessons, complete challenges, and unlock achievements.
                </p>

                <div className="flex gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-sm">
                        Beginner
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm">
                        Challenge
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm">
                        Top 10
                    </span>
                </div>
            </div>
        </div>
    </section>

    {/* Section A */}
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left textz */}
        <div>
            <p className="inline-block px-4 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm mb-4">
                Why MathDex?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Learn step by step with challenges that keep you engaged
            </h2>

            <p className="text-slate-300 leading-8 mb-8 max-w-xl">
                MathDex helps undergraduate students learn mathematics through structured lessons and chapter-based challenges. Each chapter is designed to build understanding progressively while keeping learning interactive and motivating.
            </p>

            <div className="space-y-4">
                <div className="rounded-2xl border border-sky-500/10 bg-slate-900/70 p-4">
                    <h3 className="text-xl font-semibold mb-2">Structured Lessons</h3>
                    <p className="text-slate-400 leading-7">
                        Learn chapter by chapter with guided exercises and clear progression.
                    </p>
                </div>

                <div className="rounded-2xl border border-sky-500/10 bg-slate-900/70 p-4">
                    <h3 className="text-2xl font-semibold mb-2">Chapter Challenges</h3>
                    <p className="text-slate-400 leading-7">
                        Test your understanding through mini tests after each chapter.
                    </p>
                </div>
            </div>
        </div>

        {/* Right visual */}
        <div className="relative flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-sky-500/20 bg-slate-900/80 p-6 shadow-2xl shadow-blue-900/20">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sky-400 font-medium">Chapter 1</span>
                    <span className="text-yellow-400 font-medium">Unlocked</span>
                </div>

                <h3 className="text-2xl font-bold mb-3">Differentiation</h3>
                <p className="text-slate-300 mb-6 leading-7">
                    Learn core concepts, complete challenges. and move to the next chapter.
                </p>

                <div className="space-y-3">
                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>Lesson 1</span>
                        <span className="text-sky-400">Complete</span>
                    </div>

                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>Lesson 2</span>
                        <span className="text-yellow-400">In progress</span>
                    </div>
                    
                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>Lesson 3</span>
                        <span className="text-slate-400">Locked</span>
                    </div>
                </div>
            </div>

            {/* floating mini badge */}
            <div className="absolute -top-4 -right-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/20 text-sky-300 text-sm shadow-lg">
                +20XP
            </div>
        </div>
    </section>

    {/* Section B */}
    <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left visual */}
        <div className="relative w-full max-w-md">
            <div className="rounded-3xl border border-sky-500/20 bg-slate-900/80 p-6 shadow-2xl shadow-blue-900/20">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sky-400 font-medium">Leaderboard</span>
                    <span className="text-yellow-400 font-medium">Weekly</span>
                </div>

                <div className="space-y-3">
                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>1. Jack Ng</span>
                        <span className="text-yellow-400">420 XP</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>2. Hann</span>
                        <span className="text-yellow-400">380 XP</span>
                    </div>
                    <div className="rounded-xl bg-slate-800/80 px-4 py-3 flex justify-between">
                        <span>3. Timothy</span>
                        <span className="text-yellow-400">350 XP</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-sm">
                        Beginner
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-sky-300 text-sm">
                        Challenger
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-sky-300 text-sm">
                        Top 10
                    </span>
                </div>
            </div>
            
            {/* floating reward bubble */}
            <div className="absolute -bottom-4 -left-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-400/20 text-yellow-300 text-sm shadow-lg">
                +1 Badge
            </div>
        </div>

            {/* right text */}
            <div className="w-full">
                <p className="inline-block px-4 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm mb-4">
                    Rewards & Motivation
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Earn badges, collect rewards, and stay motivated
                </h2>

                <p className="text-slate-300 leading-8 mb-8 max-w-xl">
                    MathDex uses gamification features such as badges, coins, and leaderboard rankings to make learning more rewarding. These elements help students stay active, track achievements, and remain motivated throughout the course.
                </p>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-sky-500/10 bg-slate-900/70 p-4">
                        <h3 className="text-xl font-semibold mb-2">Badges & Coins</h3>
                        <p className="text-slate-400 leading-7">
                            Earn achievements and rewards as you improve your learning progess.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-sky-500/10 bg-slate-900/70 p-4">
                        <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
                        <p className="text-slate-400 leading-7">
                            Stay motivated through healthy competition with other students.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
        {/* CTA section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="rounded-3xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to start with you math journey?
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-7">
                    Join MathDex and make mathematics learning more interactive, rewarding, and motivating.
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 rouned-full bg-gradient-to-r from-sky-400 to-blue-600 font-semibold shadow-lg shadow-sky-500/30 hover:scale-105 transition"
                    >
                        Create Account
                </button>
            </div>
        </section>
    </div>
    );
}

export default LandingPage;
