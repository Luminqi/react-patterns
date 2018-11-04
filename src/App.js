import React, { Component, Suspense } from 'react';
// import { Accordion, Tabs, items } from './Accordion/index'
// import { items } from './accordion/data'
// import { Accordion } from './accordion/hook-accordion'
import { Spinner } from './components/spinner'
const HomePage = React.Lazy(() => import('./components/homePage'))

class App extends Component {
  render() {
    return (
      <div className="App">
        <Suspense fallback={<Spinner size="large" />}>
          <HomePage />
        </Suspense>
      </div>
    );
  }
}

export default App;
