import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Reports from './pages/GeographicFilter';
import GeographicFilter from './pages/GeographicFilter';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/geographic-filter' component={GeographicFilter} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
