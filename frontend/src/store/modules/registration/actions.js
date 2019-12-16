export function getAllRequest() {
  return {
    type: '@registration/GET_ALL_REQUEST',
  };
}

export function getAllSuccess(payload) {
  return {
    type: '@registration/GET_ALL_SUCCESS',
    payload,
  };
}

export function registrationFailed() {
  return {
    type: '@registration/REGISTRATION_FAILED',
  };
}

export function registrationDeleteRequest(registration_id) {
  return {
    type: '@registration/REGISTRATION_DELETE_REQUEST',
    payload: { registration_id },
  };
}