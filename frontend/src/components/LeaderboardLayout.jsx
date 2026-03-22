import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Leaderboard() {
    return (
        <section className="leaderboard-section">
            <div className="leaderboard-header">
                <div>
                    <h1 className="leaderboard-title">Leaderboard</h1>
                    <p className="leaderboard-description">
                        See who's dominating the coding arena! Earn XP, climb the ranks, and become a legend!!
                    </p>
                </div>
            </div>
            <div className="leaderboard-card">
                <div className="leaderboard-list">
                    <div className="leaderboard-row leaderboard-row-header">
                        <span>Rank</span>
                        <span>Name</span>
                        <span>Points</span>
                    </div>
                    
                    <div className="leaderboard-row">
                        <span>1</span>
                        <span>John Doe</span>
                        <span>1000</span>

                        <span>2</span>
                        <span>Jane Smith</span>
                        <span>900</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Leaderboard;