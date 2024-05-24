import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeOrder } from './store';
import axios from 'axios';

const Home: React.FC = () => {
    const orders = useSelector((state: RootState) => state.orders.orders);
    const dispatch = useDispatch();

    const handleDelete = (index: number) => {
        axios.delete(`api/orders/${index}`).then(() => {
            dispatch(removeOrder(index));
        });
    };

    return (
        <div>
            <h1>Order List</h1>
            <ul>
                {orders.map((order, index) => (
                    <li key={index}>
                        {order.firstName} {order.lastName} - {order.description} ({order.quantity})
                        <button onClick={() => handleDelete(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
