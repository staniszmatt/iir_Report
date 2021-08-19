import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import TearDownSummerPage from './containers/TearDownSummeryPage';
import IIRAddEditPage from './containers/IIRAddEditPage';
import NavBar from './components/navBar';
import ErrorModal from './components/modals/ModalPage';

export default function Routes() {
  return (
    <App>
      <ErrorModal />
      <NavBar />
      <Switch>
        <Route path={routes.EDITFORM} component={IIRAddEditPage} />
        <Route path={routes.IIRFORM} component={TearDownSummerPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
