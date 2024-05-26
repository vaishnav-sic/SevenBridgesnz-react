import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store, { configureStore, RootState, AppDispatch } from './store'; // Assuming configureStore returns the correct type
import Home from './Home';
import NewItem from './NewItem';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('api/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                // Assuming you have an action creator addOrders to dispatch here
                // dispatch(addOrders(data));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [dispatch]);

    return (
        <Provider store={store}>
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
        </Provider>
    );
};

export default App;
