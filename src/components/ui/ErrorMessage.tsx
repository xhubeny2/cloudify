import "./style.scss";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-message__retry">
          Try again
        </button>
      )}
    </div>
  );
}
