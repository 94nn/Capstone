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
                <div>
                    <p className="inline-block px-4 py-1 rounded-full bg-sky-500/10 text-sky-400 text-sm mb-5">
                        Gamified E-Learning Platform
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        Learn Mathematics Through Challenges
                    </h1>

                    <p className="text-slate-300 text-lg leading-8 mb-8 max-w-2xl">
                        MathDex is a gamified math learning platform where students complete challenges, earn badges, collections, and punch down all the bitches on leaderboard.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 font-semibold shadow-lg shadow-sky-500/30 hover:scale-105 transition"
                            >
                                Get Started
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-3 rounded-full border border-slate-500 text-white hover:bg-slate-800 transition"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* right side preview card */}
                <div className="bg-slate-900/80 border border-sky-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-900/20">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sky-400 font-medium">Level 1</span>
                        <span className="text-yellow-400 font-medium">120 XP</span>
                    </div>
                <h2 className="text-2xl font-bold mb-3">Differentiation</h2>
                <p className="text-slate-300 mb-6">
                    Study lessons, complete challenges and unlock achievements.
                </p>

                <div className="flex gap-3 flex wrap"></div>
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-sm">Beginner</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm">Challenge</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm">Top 10</span>    
                </div>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MathDex?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Designed to make mathematics more engaging, interactive, and rewarding for undergraduate students.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                            <h3 className="text-xl font-semi mb-3">Structured Lessons</h3>
                            <p className="text-slate-400 leading-7">
                                Learn chapter by chapter with guided exercises and clear progression.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                        <h3 className="text-xl font-semibold mb-3">Chapter Challenges</h3>
                        <p className="text-slate-400 leading-7">
                            Test your understanding through mini tests after chapter.
                        </p>
                    </div>

                    <div className=""></div>
                </section>
            </div>
        </section>
        </div>
    )
}

export default LandingPage;
