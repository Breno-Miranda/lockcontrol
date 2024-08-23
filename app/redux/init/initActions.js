// actions.js
export const ACTION_TYPE = 'ACTION_TYPE';
export const ACTION_REST = 'ACTION_REST';

export const actionCreator = (payload) => ({
  type: ACTION_TYPE,
  payload,
});

export const actionRest = () => ({
  type: ACTION_REST,
});

