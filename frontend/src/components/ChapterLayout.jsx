function ChapterLayout() {
	return (
		<section className="lesson-section">
			<div className="lesson-header">
				<div className="step-indicator">1</div>
				<div>
				<h1 className="lesson-title">Differentiation</h1>
				</div>
			</div>

			<div className="lesson-card">
				<p className="lesson-description">
				Learn how to differentiate functions.
				</p>

				<div className="exercise-list">
				<div className="exercise-row exercise-row-header">
					<span>Exercise</span>
					<span>Title</span>
					<span>Status</span>
				</div>

				<div className="exercise-row">
					<span className="exercise-label">Exercise 1</span>
					<span className="exercise-title">Basics</span>
					<button className="start-button">Start</button>
				</div>

				<div className="exercise-row">
					<span className="exercise-label">Exercise 2</span>
					<span className="exercise-title">First Derivative</span>
					<button className="start-button">Start</button>
				</div>

				<div className="exercise-row">
					<span className="exercise-label">Exercise 3</span>
					<span className="exercise-title">Second Derivative</span>
					<button className="start-button">Start</button>
				</div>
				</div>
			</div>

			<div className="next-chapter">
				<span className="next-chapter-header">Next Chapter</span>
				<div className="next-chapter-preview">
				<span className="next-chapter-step-indicator">2</span>
				<span className="next-chapter-title">Integration</span>
				</div>
				<button className="next-chapter-button">Next Chapter</button>
			</div>
		</section>
  	);
}

export default ChapterLayout;