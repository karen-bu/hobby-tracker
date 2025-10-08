import hobbyHorseLogo from '../assets/HobbyHorse Logo White.svg';

export function HeaderWelcome() {
  return (
    <div className="header-welcome-container">
      <div className="header-welcome-link">
        <img src={hobbyHorseLogo} alt="hobbyHorse logo" />
        <h2>Welcome, Karen!</h2>
      </div>
      <div className="header-welcome-link log-out">
        <a>Log Out</a>
      </div>
    </div>
  );
}
