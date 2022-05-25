export const ADD_PARTICIPANT = "ADD_PARTICIPANT";
export const REMOVE_PARTICIPANT = "REMOVE_PARTICIPANT";
export const SET_USER = "SET_USER";
export const SET_MAIN_STREAM = "SET_MAIN_STREAM";
export const UPDATE_PARTICIPANT = "UPDATE_PARTICIPANT";
export const UPDATE_USER = "UPDATE_USER";

export const setUser = (payload) => ({ type: SET_USER, payload });
export const addParticipant = (payload) => ({ type: ADD_PARTICIPANT, payload });
export const removeParticipant = (payload) => ({
  type: REMOVE_PARTICIPANT,
  payload,
});
export const setMainStream = (payload) => ({
  type: SET_MAIN_STREAM,
  payload,
});
export const updateParticipant = (payload) => ({
  type: UPDATE_PARTICIPANT,
  payload,
});

export const updateUser = (payload) => ({ type: UPDATE_USER, payload });
