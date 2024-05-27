import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from '../../store';
import { useNavigate } from 'react-router-dom';
import './NewItem.css';

const NewItem: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const history = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newOrder = {
            firstName,
            lastName,
            description,
            quantity
        };

        try {
            const response = await fetch('api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(addOrder(data));
                history('/');
            } else {
                console.error('Failed to create order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const isFormValid =
        lastName.length > 0 &&
        lastName.length <= 20 &&
        description.length > 0 &&
        description.length <= 100 &&
        quantity >= 1 &&
        quantity <= 20;

    return (
        <form onSubmit={handleSubmit} className="new-item-form">
            <div>
                <label>
                    First Name (Optional):
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        maxLength={20}
                    />
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        maxLength={20}
                    />
                </label>
            </div>
            <div>
                <label>
                    Order Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        maxLength={100}
                    />
                </label>
            </div>
            <div>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                        min={1}
                        max={20}
                    />
                </label>
            </div>
            <button type="submit" disabled={!isFormValid}>
                Submit
            </button>
        </form>
    );
};

export default NewItem;
