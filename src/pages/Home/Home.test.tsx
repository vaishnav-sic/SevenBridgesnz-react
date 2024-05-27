import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import fetchMock from 'jest-fetch-mock';
import Home from './Home';
import { Store, UnknownAction } from 'redux';
import { Order } from '../../store';

const mockStore = configureStore([]);

const mockOrders: Order[] = [
    { id: 1, firstName: 'Rahul', lastName: 'Ji', description: 'Order description 1', quantity: 10 },
    { id: 2, firstName: 'Summer', lastName: 'Ji', description: 'Order description 2', quantity: 5 },
];

describe('Home Component', () => {
    let store: MockStoreEnhanced<unknown, {}> | Store<unknown, UnknownAction, unknown>;

    beforeEach(() => {
        fetchMock.resetMocks();
        store = mockStore({
            orders: {
                orders: [],
            },
        });
    });


    test('handles delete order', async () => {
        store = mockStore({
            orders: {
                orders: mockOrders,
            },
        });

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        const deleteButtons = await screen.findAllByText('Delete');
        expect(deleteButtons).toHaveLength(2);

        fetchMock.mockResponseOnce(JSON.stringify({}));

        // Simulate clicking the delete button
        fireEvent.click(deleteButtons[0]);

        // Manually update the store's state to reflect the deletion
        const updatedOrders = mockOrders.filter(order => order.id !== 1);
        store = mockStore({
            orders: {
                orders: updatedOrders,
            },
        });

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByText(/Rahul Ji/)).toBeInTheDocument();
        });
    });
});