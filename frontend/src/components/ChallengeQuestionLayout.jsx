import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


function ChallengeQuestionLayout() { // 这里要接api拿到challenge的内容
    const { slug } = useParams();
    const [challenge, setChallenge] = useState([]);
    // const challenge = challenges[0];

useEffect(() => {
    async function loadData() {
        try {
            const res = await axios.get(`/api/challenge/${slug}`);
            setChallenge(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Failed to load data", error);
            setChallenge([]);
        }
    }

    if (slug) loadData();
}, [slug]);
    


    return (
        <section className="challenge-section">
            <div className="challenge-header">
                <div>
                    <h1 className="challenge-title">{challenge[0]?.title}</h1>
                </div>
            </div>
            <br />
            <div className="challenge-card">
                <div className="question-row">
                    {challenge.length === 0 ? (
                        <div className="challenge-question-header">
                            <p>No challenge found</p>
                        </div>
                    ) : (
                    challenge.map((c) => (
                        <div className="challenge-question-header" key={c.id} >
                            <p>{c.content}</p>
                        </div>
                    ))
                    )}
                </div>
            </div>
            <br />
            {/* <div className="challenge-card">
                <div className="answer-row">
                    <h3 className="challenge-question-header">Question 1</h3>
                </div>
            </div>
            <br />
            <div className="challenge-card">
                <div className="answer-row">
                    <h3 className="challenge-question-header">Question 2</h3>
                </div>
            </div>
            <br />
            <div className="challenge-card">
                <div className="answer-row">
                    <h3 className="challenge-question-header">Question 3</h3>
                </div>
            </div> */}

        </section>
    );
}

export default ChallengeQuestionLayout;