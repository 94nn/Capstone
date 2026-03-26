import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ChallengeLayout.css'

const mockChallenges = [
    {
        id: 1,
        title: 'Control Flow',
        topic: 'Algebra',
        num_challenges: 5,
        duration_min: 40,
        xp: 50,
        slug: 'control-flow',
        bg_color: '#1a6fc4',
    },
    {
        id: 2,
        title: 'Functions',
        topic: 'Calculus',
        num_challenges: 6,
        duration_min: 50,
        xp: 60,
        slug: 'functions',
        bg_color: '#1a6fc4',
    },
    {
        id: 3,
        title: 'Probability Basics',
        topic: 'Probability',
        num_challenges: 4,
        duration_min: 30,
        xp: 40,
        slug: 'probability-basics',
        bg_color: '#7c3aed',
    },
    {
        id: 4,
        title: 'Limits & Derivatives',
        topic: 'Calculus',
        num_challenges: 7,
        duration_min: 60,
        xp: 70,
        slug: 'limits-derivatives',
        bg_color: '#7c3aed',
    },
    {
        id: 5,
        title: 'Sequences & Series',
        topic: 'Algebra',
        num_challenges: 5,
        duration_min: 45,
        xp: 55,
        slug: 'sequences-series',
        bg_color: '#1a6fc4',
    },
    {
        id: 6,
        title: 'Bayes Theorem',
        topic: 'Probability',
        num_challenges: 4,
        duration_min: 35,
        xp: 45,
        slug: 'bayes-theorem',
        bg_color: '#7c3aed',
    },
]

const FILTERS = ['All', 'Algebra', 'Calculus', 'Probability']

const ChallengeCard = ({ challenge, onClick }) => {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            className={`ch-card ${hovered ? 'ch-card--hovered' : ''}`}
            style={{ '--card-bg': challenge.bg_color }}
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

            {/* Hover face */}
            <div className={`ch-card-back ${hovered ? 'ch-card-back--visible' : ''}`}>
                <p className="ch-card-desc">
                    Practice {challenge.title} and sharpen your problem-solving skills.
                </p>
                <div className="ch-card-divider" />
                <div className="ch-card-meta">
                    <span className="ch-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {challenge.num_challenges} Challenges
                    </span>
                    <span className="ch-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {challenge.duration_min} min
                    </span>
                </div>
                <div className="ch-card-xp">{challenge.xp} XP</div>
            </div>
        </div>
    )
}

const ChallengePage = () => {
    const [challenges, setChallenges] = useState(mockChallenges)
    const [activeFilter, setActiveFilter] = useState('All')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/challenges')
            .then(res => setChallenges(res.data))
            .catch(() => {/* keep mock data */})
    }, [])

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
                {FILTERS.map(f => (
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
            <div className="ch-grid">
                {filtered.map(challenge => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onClick={(slug) => navigate(`/challenges/${slug}`)}
                    />
                ))}
                {filtered.length === 0 && (
                    <p className="ch-empty">No challenges found for this topic.</p>
                )}
            </div>
        </div>
    )
}

export default ChallengePage