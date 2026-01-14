import "./style.scss";
import InputWrapper from "@/components/search";

export function Header() {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <img src="src/assets/logo.svg" alt="Cloudify Logo" className="logo" />
        <h2>Cloudify</h2>
      </div>
      <InputWrapper />
    </header>
  );
}
