import "./style.scss";
import InputWrapper from "@/components/search";
import logoSvg from "@/assets/logo.svg";
import { LocationButton } from ".";

export function Header() {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <img src={logoSvg} alt="Cloudify Logo" className="logo" />
        <h2>Cloudify</h2>
      </div>
      <InputWrapper />
      <LocationButton />
    </header>
  );
}
