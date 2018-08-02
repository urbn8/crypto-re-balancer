import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import './tacit-css-1.3.0.min.css'
import './reset.css'
import './index.css'

let render = () => {
  // const App = require('./Chart').default;
  const App = require('./BacktestDashboard').default;
  ReactDOM.render(
    React.createElement(App, null, null),
    document.getElementById('app')
  )
}

render();
if (module.hot) { module.hot.accept(render); }
