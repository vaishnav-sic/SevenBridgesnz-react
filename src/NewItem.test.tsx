import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import NewItem from './NewItem';
import { addOrder } from './store';
import { Store, UnknownAction } from 'redux';

const mockStore = configureStore([]);
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('NewItem Component', () => {
    let store: MockStoreEnhanced<unknown, {}> | Store<unknown, UnknownAction, unknown>;

    beforeEach(() => {
        store = mockStore({
            orders: []
        });

        store.dispatch = jest.fn();
        fetchMock.resetMocks();
    });

    test('renders form fields correctly', () => {
        render(
            <Provider store={store}>
                <Router>
                    <NewItem />
                </Router>
            </Provider>
        );

        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Order Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('form validation works correctly', () => {
        render(
            <Provider store={store}>
                <Router>
                    <NewItem />
                </Router>
            </Provider>
        );

        const submitButton = screen.getByRole('button', { name: /Submit/i });

        // Initially, the submit button should be disabled
        expect(submitButton).toBeDisabled();

        // Fill out the form correctly
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Order Description/i), { target: { value: 'Order description' } });
        fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 5 } });

        // The submit button should be enabled
        expect(submitButton).toBeEnabled();
    });

    test('form submission works correctly', async () => {
        const mockOrder = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            description: 'Order description',
            quantity: 5
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockOrder), { status: 201 });

        render(
            <Provider store={store}>
                <Router>
                    <NewItem />
                </Router>
            </Provider>
        );

        // Fill out the form correctly
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Order Description/i), { target: { value: 'Order description' } });
        fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 5 } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        // Wait for fetch to be called and dispatch to be triggered
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith('api/orders', expect.any(Object));
            expect(store.dispatch).toHaveBeenCalledWith(addOrder(mockOrder));
        });
    });

    test('handles form submission failure', async () => {
        fetchMock.mockRejectOnce(new Error('Failed to create order'));

        render(
            <Provider store={store}>
                <Router>
                    <NewItem />
                </Router>
            </Provider>
        );

        // Fill out the form correctly
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Order Description/i), { target: { value: 'Order description' } });
        fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 5 } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        // Wait for fetch to be called and check that dispatch was not called
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(store.dispatch).not.toHaveBeenCalled();
        });
    });
});
