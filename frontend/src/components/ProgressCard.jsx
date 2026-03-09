function ProgressCard() {
  	return (
		<aside className="sidebar">
			<div className="card progress-card">
				<div className="progress-info">
                    <h1 className="progress-header">Progress Summary</h1>
                    <p className="progress-text">You have completed 3 out of 10 lessons.</p>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "30%" }}></div>
				</div>
			</div>
		</aside>
  );
}

export default ProgressCard;