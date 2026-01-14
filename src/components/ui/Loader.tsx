import "./style.scss";

interface LoaderProps {
  className?: string;
}

export function Loader({ className = "" }: LoaderProps) {
  return (
    <div className={`loader ${className}`.trim()}>
      <div className="loader__spinner" />
    </div>
  );
}

interface LoaderOverlayProps {
  message?: string;
}

export function LoaderOverlay({ message = "Loading..." }: LoaderOverlayProps) {
  return (
    <div className="loader-overlay">
      <Loader />
      <p className="loader-overlay__message">{message}</p>
    </div>
  );
}
