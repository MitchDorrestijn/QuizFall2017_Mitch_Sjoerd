import React from 'react';
import ReactDOM from 'react-dom';
import DataAccess from './scripts/DataAccess';
import AppRouter from './routers/AppRouter';
import 'normalize.css/normalize.css';
import './styles/styles.scss';

ReactDOM.render(<AppRouter />, document.getElementById('quizzer'));
