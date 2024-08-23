// exampleReducer.js
import { ACTION_TYPE, ACTION_REST } from './../init/initActions';

const initialState = {
  // Define initial state here
  user: {
    isLoading: false
  }
};

const initReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE:
      // Update state based on action
      return {
        ...state,
        // Update state properties based on action payload
        ...action.payload
      };
    case ACTION_REST:
      return initialState
    default:
      return state;
  }
};

export default initReducer;
