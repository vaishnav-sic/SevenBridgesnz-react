import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeOrder } from './store';

const Home: React.FC = () => {
    const orders = useSelector((state: RootState) => state.orders.orders);
    const dispatch = useDispatch();

    const handleDelete = async (index: number) => {
        try {
            const response = await fetch(`api/orders/${index}`, { method: 'DELETE' });

            if (response.ok) {
                dispatch(removeOrder(index));
            } else {
                console.error('Failed to delete the order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
