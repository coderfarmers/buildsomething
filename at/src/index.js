process.env.NODE_ENV === 'development'
  ? require('react-hot-loader/patch')
  : void 0;

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './app.tsx'

/**
 * some adapter for hot-loader
 */
if (process.env.NODE_ENV === 'development') {
  const {AppContainer} = require('react-hot-loader');
  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component/>
      </AppContainer>,
      document.getElementById('app')
    );
  };

  render(Root);

  if (module.hot) {
    module.hot.accept('./app.tsx', () => {
      const NextRoot = require('./app.tsx').default;
      render(NextRoot)
    })
  }
} else {
  ReactDOM.render(<Root/>, document.getElementById('app'));
}