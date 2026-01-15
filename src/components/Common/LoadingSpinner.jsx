import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', message }) {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner-md',
        lg: 'spinner-lg'
    };

    return (
        <div className="loading-container">
            <div className={`spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}
