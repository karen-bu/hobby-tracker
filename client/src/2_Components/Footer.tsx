import { Outlet, Link } from 'react-router';

import { FaList } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaRegChartBar } from 'react-icons/fa';
import { FaRegCheckCircle } from 'react-icons/fa';

export function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-link-container">
          <div>
            <FaList size={30} />
          </div>
          <div className="footer-link-text">
            <Link to="/hobbies">
              <p>Hobbies</p>
            </Link>
          </div>
        </div>
        <div className="footer-link-container">
          <div>
            <FaRegCalendarAlt size={30} />
          </div>
          <div className="footer-link-text">
            <Link to="/">
              <p>Calendar</p>
            </Link>
          </div>
        </div>
        <div className="footer-link-container">
          <div>
            <FaRegChartBar size={30} />
          </div>
          <div className="footer-link-text">
            <Link to="/metrics">
              <p>Metrics</p>
            </Link>
          </div>
        </div>
        <div className="footer-link-container">
          <div>
            <FaRegCheckCircle size={30} />
          </div>
          <div className="footer-link-text">
            <Link to="/goals">
              <p>Goals</p>
            </Link>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
