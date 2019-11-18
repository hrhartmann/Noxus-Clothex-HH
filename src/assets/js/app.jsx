import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import App2 from './containers/PublicationsFilters';
import UsersDistance from './components/UsersDistance';
import Trade from './containers/TradeNotifications';

const reactAppContainer = document.getElementById('react-app');
const reactdistnotice = document.getElementById('react-dist-notice');
const reactPublicationsFilters = document.getElementById('publications-filters')
const reactTradeNotifications = document.getElementById('react-trade-notifications')

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
};

if (reactPublicationsFilters) {
  ReactDOM.render(<App2 serverData={reactPublicationsFilters.dataset}/>, reactPublicationsFilters);
};

if (reactdistnotice) {
  console.log('React this notice')
  ReactDOM.render(<UsersDistance serverData={reactdistnotice.dataset}/>, reactdistnotice);
}

if (reactTradeNotifications) {
  ReactDOM.render(<Trade serverData={reactTradeNotifications.dataset}/>, reactTradeNotifications);
};