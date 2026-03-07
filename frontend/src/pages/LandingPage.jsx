import React from "react";
import TopBar from "../components/TopBar";

function LandingPage() {
    return (
        <div>
            <TopBar />

            <section className="hero">
            <h1>Learn Mathematics Through Challenges</h1>
            <p>
                MathDex is a gamified math learning platform where students complete challenges, earn badges, and climb the leaderboard. Compete all the bitches.
            </p>
                <div className="hero-buttons">
                    <button>Get Started</button>
                    <button>Login</button>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;