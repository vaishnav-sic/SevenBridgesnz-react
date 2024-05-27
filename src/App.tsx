import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Provider} from 'react-redux';
import store from './store';
import Home from './pages/Home/Home';
import NewItem from './pages/NewItem/NewItem';
import './App.css';

const App: React.FC = () => {

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
