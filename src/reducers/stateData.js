import { UPDATE_LOADING_RESPONSE } from "../actions/index";

const intializeState = {
  loading: false,
};

const stateData = (state = intializeState, action) => {
  switch (action.type) {
    case UPDATE_LOADING_RESPONSE:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default stateData;
