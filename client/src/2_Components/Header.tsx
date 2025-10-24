import hobbyHorseLogo from '../assets/HobbyHorse Logo White.svg';
import { useUser } from './useUser';

export function Header() {
  const { handleSignOut, user } = useUser();

  if (!user) {
    return (
      <div className="header">
        <div className="header-logged-out"></div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-link">
          <img src={hobbyHorseLogo} alt="hobbyHorse logo" />
          <h2>Welcome, {user?.username}!</h2>
        </div>
        <div className="header-link log-out">
          <button className="log-out" onClick={handleSignOut}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
