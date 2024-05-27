import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setOrders, removeOrder } from '../../store';
import type { Order } from '../../store';
import './Home.css'; // Import the CSS file

const Home: React.FC = () => {
    const orders = useSelector((state: RootState) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('/api/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data: Order[]) => {
                dispatch(setOrders(data));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });

            if (response.ok) {
                dispatch(removeOrder(id));
            } else {
                console.error('Failed to delete the order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="header">Order List</h1>
            <ul className="orderList">
                {orders.map((order) => (
                    <li key={order.id} className="orderItem">
                        <div className="orderDetails">
                            <strong>Id:</strong> {order.id} <br />
                            <strong>Name:</strong> {order.firstName} {order.lastName} <br />
                            <strong>Description:</strong> {order.description} <br />
                            <strong>Quantity:</strong> {order.quantity} <br />
                        </div>
                        <button 
                            className="deleteButton" 
                            onClick={() => handleDelete(order.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
