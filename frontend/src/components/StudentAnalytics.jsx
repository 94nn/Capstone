import { useEffect, useState } from 'react'
import axios from 'axios'
import './Analytics.css'

function StudentAnalytics() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const student_id = localStorage.getItem('student_id')

    useEffect(() => {
        if (!student_id) return
        axios.get(`/api/analytics/student/${student_id}`)
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching analytics:', err))
            .finally(() => setLoading(false))
    }, [student_id])

    if (loading) return <p className="an-loading">Loading analytics...</p>
    if (!data) return <p className="an-loading">No data available.</p>

    const student = data?.student || {}
    const module_stats = data?.module_stats || []
    const challenge_stats = data?.challenge_stats || []
    const quiz_accuracy = data?.quiz_accuracy || []
    const attempts = data?.attempts || []

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'modules', label: 'Modules' },
        { key: 'challenges', label: 'Challenges' },
        { key: 'attempts', label: 'Attempts' },
    ]

    // XP to next level
    const currentLevelXp = student.level * 100
    const nextLevelXp = (student.level + 1) * 100
    const xpProgress = student.xp - currentLevelXp
    const xpNeeded = nextLevelXp - currentLevelXp
    const xpPercent = Math.min(100, Math.round((xpProgress / xpNeeded) * 100))

    // Total exercises
    const totalExercises = module_stats.reduce((sum, m) => sum + m.total_subchapters, 0)
    const completedExercises = module_stats.reduce((sum, m) => sum + m.completed_subchapters, 0)

    return (
        <div className="an-page">
            <div className="an-hero">
                <h1 className="an-hero-title">My Analytics</h1>
                <p className="an-hero-subtitle">Track your learning progress across all modules and challenges.</p>
            </div>

            {/* Tabs */}
            <div className="an-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`an-tab ${activeTab === tab.key ? 'an-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
                <>
                    <div className="an-overview-grid">
                        <div className="an-stat-card">
                            <span className="an-stat-label">Level</span>
                            <span className="an-stat-value">{student.level}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Total XP</span>
                            <span className="an-stat-value">{student.xp}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Coins</span>
                            <span className="an-stat-value">{student.coins}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Badges</span>
                            <span className="an-stat-value">{student.badges}</span>
                        </div>
                    </div>

                    {/* XP to Next Level Bar */}
                    <div className="an-section">
                        <h2 className="an-section-title">XP to Next Level</h2>
                        <div className="an-card">
                            <div className="an-xp-level-bar">
                                <span className="an-xp-level-label">Lv {student.level}</span>
                                <div className="an-xp-bar-track">
                                    <div className="an-xp-bar-fill" style={{ width: `${xpPercent}%` }} />
                                </div>
                                <span className="an-xp-level-label">Lv {student.level + 1}</span>
                            </div>
                            <p className="an-xp-detail">{xpProgress} / {xpNeeded} XP ({xpPercent}%)</p>
                        </div>
                    </div>

                    {/* Donut: Overall Completion */}
                    <div className="an-section">
                        <h2 className="an-section-title">Overall Completion</h2>
                        <div className="an-chart-row">
                            <div className="an-card an-donut-card">
                                <DonutChart
                                    value={completedExercises}
                                    total={totalExercises}
                                    label="Exercises"
                                    color="#3b82f6"
                                />
                            </div>
                            <div className="an-card an-donut-card">
                                <DonutChart
                                    value={challenge_stats.length}
                                    total={6}
                                    label="Challenges"
                                    color="#22c55e"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quiz Accuracy */}
                    {quiz_accuracy.length > 0 && (
                        <div className="an-section">
                            <h2 className="an-section-title">Quiz Accuracy by Module</h2>
                            <div className="an-card">
                                <div className="an-bar-chart">
                                    {quiz_accuracy.map((qa, i) => (
                                        <div key={i} className="an-bar-row">
                                            <span className="an-bar-label">{qa.module_name}</span>
                                            <div className="an-bar-track">
                                                <div
                                                    className="an-bar-fill"
                                                    style={{
                                                        width: `${qa.accuracy}%`,
                                                        background: qa.accuracy >= 70 ? '#22c55e' : qa.accuracy >= 40 ? '#facc15' : '#ef4444'
                                                    }}
                                                />
                                            </div>
                                            <span className="an-bar-value">{qa.accuracy}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ── Modules Tab ── */}
            {activeTab === 'modules' && (
                <>
                    {/* Module Progress Bars */}
                    <div className="an-section">
                        <h2 className="an-section-title">Module Progress</h2>
                        <div className="an-card">
                            <div className="an-bar-chart">
                                {module_stats.map((mod, i) => (
                                    <div key={i} className="an-bar-row">
                                        <span className="an-bar-label">{mod.module_name}</span>
                                        <div className="an-bar-track">
                                            <div className="an-bar-fill an-bar-fill--blue" style={{ width: `${mod.progress}%` }} />
                                        </div>
                                        <span className="an-bar-value">{mod.progress}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module Detail Table */}
                    <div className="an-section">
                        <h2 className="an-section-title">Module Details</h2>
                        <div className="an-card">
                            <table className="an-table">
                                <thead>
                                    <tr>
                                        <th>Module</th>
                                        <th>Completed</th>
                                        <th>Total</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {module_stats.map((mod, i) => (
                                        <tr key={i}>
                                            <td>{mod.module_name}</td>
                                            <td>{mod.completed_subchapters}</td>
                                            <td>{mod.total_subchapters}</td>
                                            <td>
                                                <span className={`an-accuracy-badge ${mod.progress >= 100 ? 'an-accuracy-badge--good' : mod.progress > 0 ? 'an-accuracy-badge--mid' : 'an-accuracy-badge--low'}`}>
                                                    {mod.progress}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ── Challenges Tab ── */}
            {activeTab === 'challenges' && (
                <>
                    {/* Challenge Score Chart */}
                    {challenge_stats.length > 0 && (
                        <div className="an-section">
                            <h2 className="an-section-title">Challenge Scores</h2>
                            <div className="an-card">
                                <div className="an-bar-chart">
                                    {challenge_stats.map((ch, i) => {
                                        const pct = ch.total_questions > 0 ? Math.round((ch.correct_answers / ch.total_questions) * 100) : 0
                                        return (
                                            <div key={i} className="an-bar-row">
                                                <span className="an-bar-label">{ch.challenge_title}</span>
                                                <div className="an-bar-track">
                                                    <div
                                                        className="an-bar-fill"
                                                        style={{
                                                            width: `${pct}%`,
                                                            background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#facc15' : '#ef4444'
                                                        }}
                                                    />
                                                </div>
                                                <span className="an-bar-value">{ch.correct_answers}/{ch.total_questions}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Challenge History Table */}
                    <div className="an-section">
                        <h2 className="an-section-title">Challenge History</h2>
                        <div className="an-card">
                            {challenge_stats.length === 0 ? (
                                <p className="an-empty">No challenges completed yet.</p>
                            ) : (
                                <table className="an-table">
                                    <thead>
                                        <tr>
                                            <th>Challenge</th>
                                            <th>Module</th>
                                            <th>Score</th>
                                            <th>XP</th>
                                            <th>Coins</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {challenge_stats.map((ch, i) => (
                                            <tr key={i}>
                                                <td>{ch.challenge_title}</td>
                                                <td>{ch.module_name}</td>
                                                <td>{ch.correct_answers}/{ch.total_questions}</td>
                                                <td>+{ch.xp_earned}</td>
                                                <td>+{ch.coins_earned}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ── Attempts Tab ── */}
            {activeTab === 'attempts' && (
                <>
                    {/* Attempt Summary */}
                    <div className="an-overview-grid">
                        <div className="an-stat-card">
                            <span className="an-stat-label">Total Attempts</span>
                            <span className="an-stat-value">{attempts.length}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Quiz Attempts</span>
                            <span className="an-stat-value">{attempts.filter(a => a.type === 'quiz').length}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Challenge Attempts</span>
                            <span className="an-stat-value">{attempts.filter(a => a.type === 'challenge').length}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Pass Rate</span>
                            <span className="an-stat-value">
                                {attempts.length > 0
                                    ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100)
                                    : 0}%
                            </span>
                        </div>
                    </div>

                    {/* All Attempts Table */}
                    <div className="an-section">
                        <h2 className="an-section-title">All Attempts</h2>
                        <div className="an-card">
                            {attempts.length === 0 ? (
                                <p className="an-empty">No attempts recorded yet.</p>
                            ) : (
                                <table className="an-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Module</th>
                                            <th>Score</th>
                                            <th>Result</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((a, i) => (
                                            <tr key={a.id}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <span className={`an-type-badge an-type-badge--${a.type}`}>
                                                        {a.type === 'quiz' ? 'Quiz' : 'Challenge'}
                                                    </span>
                                                </td>
                                                <td>{a.reference_title}</td>
                                                <td>{a.module_name || '-'}</td>
                                                <td>{a.correct_answers}/{a.total_questions}</td>
                                                <td>
                                                    <span className={`an-accuracy-badge ${a.passed ? 'an-accuracy-badge--good' : 'an-accuracy-badge--low'}`}>
                                                        {a.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="an-date-cell">{new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function DonutChart({ value, total, label, color }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (pct / 100) * circumference

    return (
        <div className="an-donut">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle
                    cx="70" cy="70" r={radius} fill="none"
                    stroke={color} strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
            </svg>
            <div className="an-donut-center">
                <span className="an-donut-value">{pct}%</span>
                <span className="an-donut-label">{value}/{total} {label}</span>
            </div>
        </div>
    )
}

export default StudentAnalytics
