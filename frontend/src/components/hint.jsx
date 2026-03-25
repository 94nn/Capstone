import { useEffect, useState } from "react";
import axios from "axios";

function Hint({ quiz_id }) {
    const student_id = localStorage.getItem("student_id");

    const [hint, setHint] = useState([]);
    const [unlockedHints, setUnlockedHints] = useState({});

    useEffect(() => {
        async function loadHint() {
            try {
                const {data} = await axios.get(`/api/hint/${quiz_id}`);
                setHint(Array.isArray(data) ? data : []);
            } catch (error) {
                console.log("Failed to load hint", error);
                setHint([]);
            }
        }

        if (quiz_id) {
            loadHint();
        }
    }, [quiz_id]);

    async function unlockHint(h) {
        try {
            const { data } = await axios.post("/api/hint/unlock", {
                student_id: student_id,
                hint_id: h.id,
            });
            setUnlockedHints((prev) => ({
                ...prev,
                [h.id]: data.content,
            }));
        } catch (error) {
            console.log("Failed to unlock hint", error);
        }
    };

    return (
        <aside className="learning-sidebar">
            <div className="card hint-card">
                <h1 className="card-header">Hint</h1>
                {hint.length === 0 ? (
                    <p>No hints available</p>
                ) : (
                    hint.map((h) => (
                        <div key={h.id} className={unlockedHints[h.id] ? "hint-unlocked" : "hint-item"}>
                            {unlockedHints[h.id] ? (
                                <div>
                                    <h2 className="hint-header">Hint Unlocked</h2>
                                    <p>{unlockedHints[h.id]}</p>
                                </div>
                            ) : h.type === "free" ? (
                                <>
                                    <h2 className="free-badge">FREE HINT</h2>
                                    <button className="unlock-btn" onClick={() => unlockHint(h)}>
                                        Show Free Hint
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="paid-badge">PAID HINT</h2>
                                    <button className="unlock-btn" onClick={() => unlockHint(h)}>
                                        Unlock Hint ({h.price ?? 0} coins)
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

export default Hint;