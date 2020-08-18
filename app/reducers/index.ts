import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { reducer as fromReducer } from 'redux-form';
import iir from './iirReducer';

import modals from './modals';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    form: fromReducer,
    modals,
    iir
  });
}
