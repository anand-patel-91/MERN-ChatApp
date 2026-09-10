import React from "react";

const ProgressBar = ({ value }) => (
  <div className="upload-progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
    <span style={{ width: `${value}%` }} />
    <small>Uploading {value}%</small>
  </div>
);

export default ProgressBar;
