import React from "react";

export default function ContinueProgress({
  courseLabel = "COURSE",
  courseTitle = "HTML",
  imageSrc = "images/course_background.jpg",
  imageAlt = "Course Banner",
  progress = 40,
  onClick,
}) {
  return (
    <div className="cp-section">
        <h1 className="cp-heading">Continue progress</h1>

        <div className="cp-card" onClick={onClick}>
            {/* Banner Image */}
            <div className="cp-image-wrap">
                <img src={imageSrc} alt={imageAlt} className="cp-image" />
            </div>

            {/* Card Body */}
            <div className="cp-body">
                <span className="cp-label">{courseLabel}</span>
                <span className="cp-title">{courseTitle}</span>

                {/* Optional progress bar */}
                {progress > 0 && (
                    <div className="cp-progress-wrap">
                        <span className="cp-progress-label">{progress}%</span>
                        <div className="cp-progress-bar">
                        <div
                            className="cp-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}