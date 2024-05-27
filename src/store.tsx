import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {  // Ensure Order type is exported
    id: number;
    firstName: string;
    lastName: string;
    description: string;
    quantity: number;
}

interface OrdersState {
    orders: Order[];
}

const initialState: OrdersState = {
    orders: []
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder(state, action: PayloadAction<Order>) {
            state.orders.push(action.payload);
        },
        setOrders(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
        },
        removeOrder(state, action: PayloadAction<number>) {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        }
    }
});

export const { addOrder, setOrders, removeOrder } = ordersSlice.actions;

const store = configureStore({
    reducer: {
        orders: ordersSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { configureStore };
export default store;
