import hobbyHorseLogo from '../assets/HobbyHorse Logo White.svg';

export function Header() {
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-link">
          <img src={hobbyHorseLogo} alt="hobbyHorse logo" />
          <h2>Welcome, Karen!</h2>
        </div>
        <div className="header-link log-out">
          <a>Log Out</a>
        </div>
      </div>
    </div>
  );
}
