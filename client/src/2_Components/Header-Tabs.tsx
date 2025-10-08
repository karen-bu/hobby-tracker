import { Outlet, Link } from 'react-router';

import { FaList } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaRegChartBar } from 'react-icons/fa';
import { FaRegCheckCircle } from 'react-icons/fa';

export function HeaderTabs() {
  return (
    <div>
      <div className="header-tabs-container">
        <div className="header-tabs-link-container">
          <div>
            <FaList />
          </div>
          <div>
            <Link to="/hobbies">
              <p>Hobbies</p>
            </Link>
          </div>
        </div>
        <div className="header-tabs-link-container">
          <div>
            <FaRegCalendarAlt />
          </div>
          <div>
            <Link to="/">
              <p>Calendar</p>
            </Link>
          </div>
        </div>
        <div className="header-tabs-link-container">
          <div>
            <FaRegChartBar />
          </div>
          <div>
            <Link to="/metrics">
              <p>Metrics</p>
            </Link>
          </div>
        </div>
        <div className="header-tabs-link-container">
          <div>
            <FaRegCheckCircle />
          </div>
          <div>
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
