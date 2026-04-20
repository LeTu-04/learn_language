import './progress.css'


interface ProgressBarProps {
    total : number;
    current : number;
    label : string
}

export default function ProgressBar ({total, current, label = "Câu"} : ProgressBarProps) {
    const percent = Math.min(Math.max((current/total) * 100, 0), 100)
    return (
        <div className="progress-container">
            <div className="progress-text">
                <span> {label} {current}/ {total} </span>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={ {width : `${percent}%`} } >
                </div>
            </div>
        </div>
    )
}