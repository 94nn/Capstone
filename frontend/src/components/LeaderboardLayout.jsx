import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Leaderboard.css";
import { getImageUrl } from "../utils/imageUrl";

const RANK_COLORS = {
    1: { color: "#FFB800", glow: "rgba(255,184,0,0.4)"   },
    2: { color: "#6C8EFF", glow: "rgba(108,142,255,0.4)" },
    3: { color: "#FF4ECD", glow: "rgba(255,78,205,0.4)"  },
};

function Starfield() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animId;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const stars = Array.from({ length: 160 }, () => ({
            x: Math.random(), y: Math.random(),
            r: Math.random() * 1.6 + 0.3,
            alpha: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
        }));

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.008;
            stars.forEach(s => {
                const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="starfield" />;
}

function Avatar({ name, src, size }) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const imgSrc = getImageUrl(src);
    const hasImage = !!src;
    return (
        <div className="leaderboard-avatar" style={{ width: size, height: size, fontSize: size * 0.3 }}>
            {hasImage
                ? <img src={imgSrc} alt={name} onError={e => { e.target.style.display = "none"; }} />
                : initials}
        </div>
    );
}

function PointsBar({ xp, max }) {
    const pct = Math.round((xp / max) * 100);
    return (
        <div className="leaderboard-points-bar-track">
            <div className="leaderboard-points-bar-fill" style={{ width: `${pct}%` }} />
        </div>
    );
}

function PodiumCard({ student, rank }) {
    const { color, glow } = RANK_COLORS[rank];
    const isFirst = rank === 1;

    return (
        <div className={`leaderboard-podium-card${isFirst ? " first" : ""}`}>
            <div
                className="leaderboard-podium-rank-badge"
                style={{ border: `2px solid ${color}`, color, boxShadow: `0 0 12px ${glow}` }}
            >
                {rank}
            </div>

            {isFirst && (
                <div className="leaderboard-podium-gold-star" style={{ filter: `drop-shadow(0 0 10px ${glow})` }}>
                    ★
                </div>
            )}

            <Avatar name={student.name} src={student.profile_pic} size={isFirst ? 92 : 76} />

            <div className="leaderboard-podium-player-info">
                <p className="leaderboard-podium-player-name">{student.name}</p>
                <p className="leaderboard-podium-points" style={{ color, textShadow: `0 0 18px ${glow}` }}>
                    {student.xp_balance.toLocaleString()} XP
                </p>
            </div>
        </div>
    );
}

function LeaderRow({ student, rank, maxXp }) {
    return (
        <div className="leader-row">
            <div className="leader-rank-badge">{rank}</div>
            <Avatar name={student.name} src={student.profile_pic} size={48} />
            <div className="leader-info">
                <p className="leader-name">{student.name}</p>
            </div>
            <div className="leader-score">
                <span className="leader-points">{student.xp_balance.toLocaleString()} XP</span>
                <PointsBar xp={student.xp_balance} max={maxXp} />
            </div>
        </div>
    );
}

function Leaderboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        axios.get("/api/leaderboard/all")
            .then(res => setStudents(res.data))
            .catch(() => setError("Failed to load leaderboard."))
            .finally(() => setLoading(false));
    }, []);

    const maxXp = students[0]?.xp_balance || 1;
    const top3  = [students[1], students[0], students[2]];
    const rest  = students.slice(3);

    return (
        <section className="leaderboard-section">
            <Starfield />

            <div className="leaderboard-content">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Leaderboard</h1>
                    <p className="leaderboard-description">
                        See who's dominating the coding arena! Earn XP, climb the ranks, and become a legend!!
                    </p>
                </div>

                {loading && <p className="leaderboard-status">Loading...</p>}
                {error   && <p className="leaderboard-status leaderboard-error">{error}</p>}

                {!loading && !error && students.length >= 3 && (
                    <div className="leaderboard-podium-wrapper">
                        <PodiumCard student={top3[0]} rank={2} />
                        <PodiumCard student={top3[1]} rank={1} />
                        <PodiumCard student={top3[2]} rank={3} />
                    </div>
                )}

                {!loading && !error && (
                    <div className="leaderboard-list-rows">
                        {rest.map((student, i) => (
                            <LeaderRow
                                key={student.id}
                                student={student}
                                rank={i + 4}
                                maxXp={maxXp}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Leaderboard;