import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-secondary">
                    Try Again
                </button>
            )}
        </div>
    );
}
