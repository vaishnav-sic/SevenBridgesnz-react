const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom/extend-expect');
const { Provider } = require('react-redux');
const { BrowserRouter: Router } = require('react-router-dom');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const configureStore = require('redux-mock-store').default;
const NewItem = require('./NewItem').default;
const { addOrder } = require('./store');

// Define the state shape
interface AppState {
    orders: any[];
}

const mockStore = configureStore<AppState>([]);
const mockAxios = new MockAdapter(axios);

describe('NewItem Component', () => {
    let store: MockStoreEnhanced<AppState>;

    beforeEach(() => {
        store = mockStore({
            orders: []
        });

        store.dispatch = jest.fn();
    });

    afterEach(() => {
        mockAxios.reset();
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

        mockAxios.onPost('api/orders').reply(201, mockOrder);

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

        // Wait for axios to be called and dispatch to be triggered
        await waitFor(() => {
            expect(mockAxios.history.post.length).toBe(1);
            expect(store.dispatch).toHaveBeenCalledWith(addOrder(mockOrder));
        });

        // Log request data to debug if necessary
        console.log(mockAxios.history.post[0].data);
    });
});
