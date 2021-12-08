import React, { useState } from 'react';
import Navbar from './Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GeographicFilter from '../pages/GeographicFilter';
import Home from '../pages/Home';
import ContestHandler from '../pages/ContestHandler';
import ContestView from '../pages/ContestView';

function Layout({ setLocale }) {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app  ${toggled ? 'toggled' : ''}`}>
    <Router>
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
        </Switch>
      </Router>
    </div>
  );
}

export default Layout;
