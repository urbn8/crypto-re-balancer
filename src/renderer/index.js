import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from "mobx"

import "@blueprintjs/core/lib/css/blueprint.css"

// import './tacit-css-1.3.0.min.css'
import './reset.css'
import './index.css'

configure({enforceActions: 'observed'})

let render = () => {
  // const App = require('./Chart').default;
  const App = require('./components/BacktestPage/BacktestPage').default;
  ReactDOM.render(
    React.createElement(App, null, null),
    document.getElementById('app')
  )

  document.getElementsByTagName('body')[0].className = 'bp3-dark'
}

render();
if (module.hot) { module.hot.accept(render); }
