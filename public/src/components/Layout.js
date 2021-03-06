import React, { useState } from 'react';
import Navbar from './Navbar';
import { Switch, Route, HashRouter } from 'react-router-dom';
import GeographicFilter from '../pages/GeographicFilter';
import Home from '../pages/Home';
import ContestHandler from '../pages/ContestHandler';
import ContestView from '../pages/ContestView';
import UserTracking from '../pages/UserTracking';

/**
 * Function that contains base page layout
 */

function Layout({ setLocale }) {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  /**
   * Fonction that hide sidebar
   * @param {*} value boolean for toggling identification
   */

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app  ${toggled ? 'toggled' : ''}`}>
    <HashRouter>
      <Navbar
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/geographic-filter' component={GeographicFilter} />
          <Route path='/contest-handler' component={ContestHandler} />
          <Route path='/contest-viewer' component={ContestView} />
          <Route path='/user-tracking' component={UserTracking} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default Layout;
