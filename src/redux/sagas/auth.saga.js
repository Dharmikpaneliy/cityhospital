import { all, call, put, takeEvery } from 'redux-saga/effects'
import * as ActionTypes from '../ActionType'
import { EmailVerify, Loggedout, LoggedUser } from '../Action/auth.action'
import { loginApi, logoutAPI, signupApi } from '../../common/api/auth.api';
import { setalert } from '../Action/alert.action';
import { history } from '../../history';

function* fetchUser(action) {
   try {
      const user = yield call(signupApi, action.payload);

      yield put(setalert({ text: user.payload, color: 'success' }))
      yield put(EmailVerify(user));

   } catch (e) {
      console.log(e);
      yield put(setalert({ text: e.payload, color: 'error' }))
      yield put({ type: "USER_FETCH_FAILED", message: e.message });
   }
}

function* loginForm(action) {
   try {
      const user = yield call(loginApi, action.payload);
      yield put(setalert({ text: "Email Successfully", color: 'success' }))
      history.push('/')
      yield put(LoggedUser(user))
      console.log(user);

   }
   catch (e) {
      yield put(setalert({ text: e.payload, color: 'error' }))
      console.log(e);
   }
}

function* LogoutUser(action) {
   try {
      const user = yield call (logoutAPI, action.payload);
      yield put(setalert({text: user.payload, color: 'success'}))
      history.push('/')
      yield put(Loggedout(user))
   } catch (e) {
      yield put(setalert({ text: e.payload, color: 'error' }))
   }
}

function* watchsaga() {
   yield takeEvery(ActionTypes.AUTH_LOGIN, fetchUser);

   yield takeEvery(ActionTypes.LOGIN_FORM, loginForm);
}

function* logout() {
   yield takeEvery(ActionTypes.LOGOUT_USER, LogoutUser);
}

export function* authSaga() {
   yield all([
      watchsaga(),
      logout()
   ])
};