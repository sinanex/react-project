import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
    boys: [
        { id: 1, name: 'Rahul Sharma', category: 'A', wage: 1200, status: 'Active', bookingCount: 15, performance: 4.8 },
        { id: 2, name: 'Amit Kumar', category: 'B', wage: 800, status: 'Active', bookingCount: 22, performance: 4.5 },
        { id: 3, name: 'Suresh Singh', category: 'C', wage: 500, status: 'Inactive', bookingCount: 8, performance: 3.9 },
        { id: 4, name: 'Vicky Verma', category: 'A', wage: 1300, status: 'Active', bookingCount: 30, performance: 4.9 },
    ],
    categories: [
        { id: 'A', name: 'Skilled Worker', defaultWage: 1200, privileges: ['All access', 'Team Lead'] },
        { id: 'B', name: 'Server', defaultWage: 800, privileges: ['Serving area'] },
        { id: 'C', name: 'Helper', defaultWage: 500, privileges: ['Kitchen help'] },
    ],
    events: [
        {
            id: 1,
            title: 'Grand Wedding Reception',
            location: 'Taj Hotel, Mumbai',
            date: '2026-03-15',
            time: '18:00',
            description: 'Massive wedding event for 500+ guests.',
            required: { A: 5, B: 10, C: 15 },
            booked: { A: 3, B: 8, C: 12 },
            status: 'Upcoming'
        },
        {
            id: 2,
            title: 'Corporate Gala Dinner',
            location: 'Sahara Star, Mumbai',
            date: '2026-03-20',
            time: '19:30',
            description: 'Annual corporate event for Tech Corp.',
            required: { A: 2, B: 5, C: 5 },
            booked: { A: 2, B: 5, C: 5 },
            status: 'Full'
        }
    ],
    bookings: [
        { id: 1, boyId: 1, eventId: 1, status: 'Approved', attendance: 'Pending' },
        { id: 2, boyId: 2, eventId: 1, status: 'Pending', attendance: 'Pending' },
    ],
    notifications: [
        { id: 1, message: 'New booking request from Amit Kumar', type: 'info', time: '2 mins ago' },
        { id: 2, message: 'Event "Grand Wedding" is 80% filled', type: 'warning', time: '1 hour ago' },
    ],
    revenue: {
        monthly: [
            { month: 'Jan', revenue: 45000, expense: 32000 },
            { month: 'Feb', revenue: 52000, expense: 38000 },
            { month: 'Mar', revenue: 48000, expense: 35000 },
            { month: 'Apr', revenue: 61000, expense: 42000 },
            { month: 'May', revenue: 55000, expense: 40000 },
            { month: 'Jun', revenue: 67000, expense: 45000 },
        ],
        totalRevenue: 328000,
        totalExpense: 232000,
        totalWagePaid: 185000,
    },
    ui: {
        theme: 'dark'
    }
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        addBoy: (state, action) => {
            state.boys.push({ id: Date.now(), ...action.payload });
        },
        updateBoy: (state, action) => {
            const index = state.boys.findIndex(b => b.id === action.payload.id);
            if (index !== -1) state.boys[index] = action.payload;
        },
        deleteBoy: (state, action) => {
            state.boys = state.boys.filter(b => b.id !== action.payload);
        },
        addEvent: (state, action) => {
            state.events.push({ id: Date.now(), ...action.payload });
        },
        updateBookingStatus: (state, action) => {
            const { id, status } = action.payload;
            const booking = state.bookings.find(b => b.id === id);
            if (booking) booking.status = status;
        },
        toggleTheme: (state) => {
            state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark';
        }
    }
});

const authInitialState = {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});

export const {
    addBoy,
    updateBoy,
    deleteBoy,
    addEvent,
    updateBookingStatus,
    toggleTheme
} = appSlice.actions;

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout
} = authSlice.actions;

export const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        auth: authSlice.reducer
    },
});
