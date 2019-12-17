import { takeLatest, put, call, all } from 'redux-saga/effects';
import api from '~/services/api';
import history from '~/services/history';

import toast from '~/util/toastStyle';

import { plansSuccess, plansFailure } from './actions';

export function* getPlans() {
  try {
    const response = yield call(api.get, 'plans');

    yield put(plansSuccess(response.data));
  } catch (err) {
    toast(
      'Falha ao tentar listar os planos, tente dar um F5 na página ;)',
      '#e54b64',
      '#fff',
      '#fff'
    );

    yield put(plansFailure());
  }
}

export function* createPlan({ payload }) {
  try {
    const { title, duration, price } = payload;

    const response = yield call(api.post, '/plans', {
      title,
      duration,
      price,
    });

    if (response.status === 200) {
      history.push('/plans');
    }
  } catch (err) {
    toast(
      'Falha ao tentar criar um novo plano, verifique os dados e tente novamente',
      '#e54b64',
      '#fff',
      '#fff'
    );
  }
}

export function* editPlan({ payload }) {
  try {
    const { id, title, duration, price } = payload;

    const response = yield call(api.put, `/plans/${id}`, {
      title,
      duration,
      price,
    });

    if (response.status === 200) {
      history.push('/plans');
    }
  } catch (err) {
    toast('Erro ao tentar editar o Plano', '#e54b64', '#fff', '#fff');
  }
}

export function* deletePlan({ payload }) {
  try {
    const { id } = payload;
    const response = yield call(api.delete, `/plans/${id}`);

    if (response.status === 200) {
      window.location.reload();
    }
  } catch (err) {
    toast(
      'Erro ao tentar deletar o Plano, ele está em uso?',
      '#e54b64',
      '#fff',
      '#fff'
    );
  }
}

export default all([
  takeLatest('@plans/PLANS_REQUEST', getPlans),
  takeLatest('@plans/PLANS_CREATE_REQUEST', createPlan),
  takeLatest('@plans/PLANS_EDIT_REQUEST', editPlan),
  takeLatest('@plans/PLANS_DELETE_REQUEST', deletePlan),
]);
