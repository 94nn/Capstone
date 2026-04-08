import { useEffect, useState } from 'react'
import axios from 'axios'
import Avatar from './Avatar'
import './Analytics.css'

function AdminAnalytics() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        axios.get('/api/analytics/admin')
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching admin analytics:', err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="an-loading">Loading analytics...</p>
    if (!data) return <p className="an-loading">No data available.</p>

    const { overview, module_breakdown, top_students, challenge_breakdown } = data

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'modules', label: 'Modules' },
        { key: 'students', label: 'Students' },
        { key: 'challenges', label: 'Challenges' },
    ]

    const maxXp = top_students.length > 0 ? top_students[0].xp_balance : 1

    return (
        <div className="an-page">
            <div className="an-hero">
                <h1 className="an-hero-title">Admin Analytics</h1>
                <p className="an-hero-subtitle">Overview of student performance and platform activity.</p>
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
                    <div className="an-overview-grid an-overview-grid--5">
                        <div className="an-stat-card">
                            <span className="an-stat-label">Students</span>
                            <span className="an-stat-value">{overview.total_students}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Total XP</span>
                            <span className="an-stat-value">{overview.total_xp_earned.toLocaleString()}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Avg XP</span>
                            <span className="an-stat-value">{overview.avg_xp}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Exercises</span>
                            <span className="an-stat-value">{overview.total_exercises_completed}</span>
                        </div>
                        <div className="an-stat-card">
                            <span className="an-stat-label">Challenges</span>
                            <span className="an-stat-value">{overview.total_challenges_completed}</span>
                        </div>
                    </div>

                    {/* Module Accuracy Chart */}
                    <div className="an-section">
                        <h2 className="an-section-title">Module Accuracy</h2>
                        <div className="an-card">
                            <div className="an-bar-chart">
                                {module_breakdown.map((mod, i) => (
                                    <div key={i} className="an-bar-row">
                                        <span className="an-bar-label">{mod.module_name}</span>
                                        <div className="an-bar-track">
                                            <div
                                                className="an-bar-fill"
                                                style={{
                                                    width: `${mod.avg_accuracy}%`,
                                                    background: mod.avg_accuracy >= 70 ? '#22c55e' : mod.avg_accuracy >= 40 ? '#facc15' : '#ef4444'
                                                }}
                                            />
                                        </div>
                                        <span className="an-bar-value">{mod.avg_accuracy}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module Completions Chart */}
                    <div className="an-section">
                        <h2 className="an-section-title">Exercise Completions by Module</h2>
                        <div className="an-card">
                            <div className="an-bar-chart">
                                {module_breakdown.map((mod, i) => {
                                    const maxCompletions = Math.max(...module_breakdown.map(m => m.completions), 1)
                                    const pct = Math.round((mod.completions / maxCompletions) * 100)
                                    return (
                                        <div key={i} className="an-bar-row">
                                            <span className="an-bar-label">{mod.module_name}</span>
                                            <div className="an-bar-track">
                                                <div className="an-bar-fill an-bar-fill--blue" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="an-bar-value">{mod.completions}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Modules Tab ── */}
            {activeTab === 'modules' && (
                <>
                    <div className="an-section">
                        <h2 className="an-section-title">Module Breakdown</h2>
                        <div className="an-chart-row">
                            {module_breakdown.map((mod, i) => (
                                <div key={i} className="an-card an-donut-card">
                                    <DonutChart
                                        value={mod.completions}
                                        total={mod.total_exercises * overview.total_students}
                                        label={mod.module_name}
                                        color={['#3b82f6', '#22c55e', '#f97316'][i % 3]}
                                    />
                                    <div className="an-donut-stats">
                                        <span>{mod.unique_students} students</span>
                                        <span>{mod.avg_accuracy}% accuracy</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="an-section">
                        <h2 className="an-section-title">Module Details</h2>
                        <div className="an-card">
                            <table className="an-table">
                                <thead>
                                    <tr>
                                        <th>Module</th>
                                        <th>Exercises</th>
                                        <th>Completions</th>
                                        <th>Students</th>
                                        <th>Avg Accuracy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {module_breakdown.map((mod, i) => (
                                        <tr key={i}>
                                            <td>{mod.module_name}</td>
                                            <td>{mod.total_exercises}</td>
                                            <td>{mod.completions}</td>
                                            <td>{mod.unique_students}</td>
                                            <td>
                                                <span className={`an-accuracy-badge ${mod.avg_accuracy >= 70 ? 'an-accuracy-badge--good' : mod.avg_accuracy >= 40 ? 'an-accuracy-badge--mid' : 'an-accuracy-badge--low'}`}>
                                                    {mod.avg_accuracy}%
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

            {/* ── Students Tab ── */}
            {activeTab === 'students' && (
                <>
                    {/* XP Leaderboard Chart */}
                    <div className="an-section">
                        <h2 className="an-section-title">XP Leaderboard</h2>
                        <div className="an-card">
                            <div className="an-bar-chart">
                                {top_students.map((s, i) => {
                                    const pct = Math.round((s.xp_balance / maxXp) * 100)
                                    return (
                                        <div key={s.id} className="an-bar-row">
                                            <span className="an-bar-label">
                                                <span className="an-bar-rank">#{i + 1}</span> {s.name}
                                            </span>
                                            <div className="an-bar-track">
                                                <div
                                                    className="an-bar-fill"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: i === 0 ? '#facc15' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#3b82f6'
                                                    }}
                                                />
                                            </div>
                                            <span className="an-bar-value">{s.xp_balance} XP</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="an-section">
                        <h2 className="an-section-title">All Students</h2>
                        <div className="an-card">
                            <table className="an-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Level</th>
                                        <th>XP</th>
                                        <th>Coins</th>
                                        <th>Badges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_students.map((s, i) => (
                                        <tr key={s.id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <div className="an-student-cell">
                                                    <Avatar name={s.name} src={s.profile_pic} size={32} />
                                                    <span>{s.name}</span>
                                                </div>
                                            </td>
                                            <td>{s.level}</td>
                                            <td>{s.xp_balance.toLocaleString()}</td>
                                            <td>{s.coins_balance.toLocaleString()}</td>
                                            <td>{s.badges_balance}</td>
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
                    {/* Challenge Completion Chart */}
                    <div className="an-section">
                        <h2 className="an-section-title">Challenge Completion Count</h2>
                        <div className="an-card">
                            <div className="an-bar-chart">
                                {challenge_breakdown.map((ch) => {
                                    const maxTimes = Math.max(...challenge_breakdown.map(c => c.times_completed), 1)
                                    const pct = Math.round((ch.times_completed / maxTimes) * 100)
                                    return (
                                        <div key={ch.id} className="an-bar-row">
                                            <span className="an-bar-label">{ch.title}</span>
                                            <div className="an-bar-track">
                                                <div className="an-bar-fill an-bar-fill--green" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="an-bar-value">{ch.times_completed}x</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Challenge Table */}
                    <div className="an-section">
                        <h2 className="an-section-title">Challenge Details</h2>
                        <div className="an-card">
                            <table className="an-table">
                                <thead>
                                    <tr>
                                        <th>Challenge</th>
                                        <th>Module</th>
                                        <th>Completed</th>
                                        <th>Avg Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {challenge_breakdown.map((ch) => (
                                        <tr key={ch.id}>
                                            <td>{ch.title}</td>
                                            <td>{ch.module_name}</td>
                                            <td>{ch.times_completed}x</td>
                                            <td>{ch.avg_correct !== null ? `${ch.avg_correct}/${ch.total_questions}` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                <span className="an-donut-label">{label}</span>
            </div>
        </div>
    )
}

export default AdminAnalytics
