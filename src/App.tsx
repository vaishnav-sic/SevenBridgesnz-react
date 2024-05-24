import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setOrders } from './store';
import axios from 'axios';
import Home from './Home';
import NewItem from './NewItem';
import './App.css'
const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('api/orders').then((response) => {
      console.log(response);
      dispatch(setOrders(response.data));
    });
  }, [dispatch]);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/" className="active">Home</Link>
          </li>
          <li>
            <Link to="/new">New Item</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewItem />} />
      </Routes>
    </Router>
  );
};

export default App;