import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AdminAnalyticsPage.css'

const AdminAnalyticsPage = () => {
    const [overview, setOverview] = useState(null)
    const [modules, setModules] = useState([])
    const [challenges, setChallenges] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            axios.get('/api/admin/analytics'),
            axios.get('/api/admin/analytics/modules'),
            axios.get('/api/admin/analytics/challenges'),
        ])
            .then(([overviewRes, modulesRes, challengesRes]) => {
                setOverview(overviewRes.data)
                setModules(modulesRes.data)
                setChallenges(challengesRes.data)
            })
            .catch(err => console.error('Failed to load analytics:', err))
            .finally(() => setLoading(false))
    }, [])

    const maxModuleStarted = Math.max(...modules.map(m => m.students_started), 1)
    const maxCompletions = Math.max(...challenges.map(c => c.total_completions), 1)

    if (loading) return <p className="analytics-loading">Loading analytics...</p>

    return (
        <div className="analytics-page">
            <h1 className="analytics-title">Analytics</h1>

            {/* ── Overview stat cards ── */}
            <div className="analytics-stats">
                <div className="stat-card">
                    <span className="stat-card-label">Total Students</span>
                    <span className="stat-card-value">{overview?.total_students ?? 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Avg Level</span>
                    <span className="stat-card-value green">{overview?.avg_level ?? 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Avg XP</span>
                    <span className="stat-card-value green">{overview?.avg_xp ?? 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Exercise Completions</span>
                    <span className="stat-card-value purple">{overview?.total_subchapter_completions ?? 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Challenge Completions</span>
                    <span className="stat-card-value purple">{overview?.total_challenge_completions ?? 0}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-label">Badges Earned</span>
                    <span className="stat-card-value yellow">{overview?.total_badges ?? 0}</span>
                </div>
            </div>

            {/* ── Modules ── */}
            <div className="analytics-section">
                <h2 className="analytics-section-title">Modules</h2>

                {/* Header row */}
                <div className="module-row">
                    <span className="module-row-header">Module</span>
                    <span className="module-row-header">Students Started</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Started</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Completed</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Avg Progress</span>
                </div>

                {modules.length === 0 ? (
                    <p className="analytics-loading">No module data yet.</p>
                ) : (
                    modules.map(m => (
                        <div key={m.id} className="module-row">
                            <span className="module-name">{m.name}</span>
                            <div>
                                <div className="bar-wrap">
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${(m.students_started / maxModuleStarted) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="module-stat">
                                <strong>{m.students_started}</strong>
                                students
                            </div>
                            <div className="module-stat">
                                <strong>{m.students_completed}</strong>
                                completed
                            </div>
                            <div className="module-stat">
                                <strong>{m.avg_progress}%</strong>
                                avg
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Challenges ── */}
            <div className="analytics-section">
                <h2 className="analytics-section-title">Challenges</h2>

                {/* Header row */}
                <div className="challenge-row">
                    <span className="module-row-header">Challenge</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Completions</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Badges</span>
                    <span className="module-row-header">Avg Score</span>
                    <span className="module-row-header" style={{ textAlign: 'center' }}>Score %</span>
                </div>

                {challenges.length === 0 ? (
                    <p className="analytics-loading">No challenge data yet.</p>
                ) : (
                    challenges.map(c => (
                        <div key={c.id} className="challenge-row">
                            <div>
                                <span className="challenge-title-cell">{c.title}</span>
                                {c.badge_name && (
                                    <span className="challenge-badge-pill">🏅 {c.badge_name}</span>
                                )}
                            </div>
                            <div className="module-stat">
                                <strong>{c.total_completions}</strong>
                                completions
                            </div>
                            <div className="module-stat">
                                <strong>{c.badges_awarded}</strong>
                                awarded
                            </div>
                            <div className="score-bar-wrap">
                                <div className="bar-wrap" style={{ flex: 1 }}>
                                    <div
                                        className="bar-fill green"
                                        style={{ width: `${c.avg_score}%` }}
                                    />
                                </div>
                            </div>
                            <div className="module-stat">
                                <strong>{c.avg_score}%</strong>
                                avg score
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AdminAnalyticsPage
