import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

const rootElement = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    rootElement
);

