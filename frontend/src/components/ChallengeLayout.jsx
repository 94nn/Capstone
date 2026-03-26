import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ChallengeLayout.css'
const CARD_SCHEMES = {
    blue:   { accent: '#3b82f6', accentDark: '#1d4ed8' },
    green:  { accent: '#22c55e', accentDark: '#15803d' },
    orange: { accent: '#f97316', accentDark: '#c2410c' },
}

const TOPIC_SCHEME_MAP = {
    'Algebra':     CARD_SCHEMES.blue,
    'Calculus':    CARD_SCHEMES.green,
    'Probability': CARD_SCHEMES.orange,
}

function getCardScheme(topic) {
    return TOPIC_SCHEME_MAP[topic] || CARD_SCHEMES.blue
}

const ChallengeCard = ({ challenge, onClick }) => {
    const [hovered, setHovered] = useState(false)
    const scheme = getCardScheme(challenge.topic)

    return (
        <div
            className={`ch-card ${hovered ? 'ch-card--hovered' : ''}`}
            style={{ '--card-accent': scheme.accent, '--card-accent-dark': scheme.accentDark }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(challenge.slug)}
        >
            {/* Front face */}
            <div className={`ch-card-front ${hovered ? 'ch-card-front--hidden' : ''}`}>
                <span className="ch-card-topic">{challenge.topic}</span>
                <div className="ch-card-icon">
                    <div className="ch-card-icon-pixel" />
                </div>
                <span className="ch-card-title">{challenge.title}</span>
            </div>

            {/* Hover / back face */}
            <div className={`ch-card-back ${hovered ? 'ch-card-back--visible' : ''}`}>
                <p className="ch-card-desc">
                    Practice {challenge.title} and sharpen your problem-solving skills.
                </p>
                <div className="ch-card-divider" />
                <div className="ch-card-meta">
                    <span className="ch-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
                        </svg>
                        {challenge.num_challenges} Challenges
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="ch-card-xp">{challenge.total_xp} XP</div>
                    <div className="ch-card-xp">{challenge.total_coins} Coins</div>
                </div>
            </div>
        </div>
    )
}

const ChallengePage = () => {
    const [challenges, setChallenges] = useState([])
    const [activeFilter, setActiveFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/challenge')
            .then(res => setChallenges(res.data))
            .catch(err => console.error('Error fetching challenges:', err))
            .finally(() => setLoading(false))
    }, [])

    const topics = ['All', ...new Set(challenges.map(c => c.topic).filter(Boolean))]

    const filtered = activeFilter === 'All'
        ? challenges
        : challenges.filter(c => c.topic === activeFilter)

    return (
        <div className="ch-page">
            {/* Hero */}
            <div className="ch-hero">
                <h1 className="ch-hero-title">Challenge Packs</h1>
                <p className="ch-hero-subtitle">
                    Practice your math reps while earning XP! Complete a pack of challenges
                    to test your knowledge as you learn on Mathdex.
                </p>
            </div>

            {/* Filter pills */}
            <div className="ch-filters">
                {topics.map(f => (
                    <button
                        key={f}
                        className={`ch-filter-pill ${activeFilter === f ? 'ch-filter-pill--active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Cards grid */}
            {loading ? (
                <p className="ch-loading">Loading challenges...</p>
            ) : (
                <div className="ch-grid">
                    {filtered.length === 0 ? (
                        <p className="ch-empty">No challenges found for this topic.</p>
                    ) : (
                        filtered.map(challenge => (
                            <ChallengeCard
                                key={challenge.id}
                                challenge={challenge}
                                onClick={(slug) => navigate(`/challenge/${slug}`)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default ChallengePage