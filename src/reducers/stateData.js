import { UPDATE_RECORDING_STATE } from "../actions/index";

const intializeState = {
  recordingState: false,
};

const stateData = (state = intializeState, action) => {
  switch (action.type) {
    case UPDATE_RECORDING_STATE:
      return {
        ...state,
        recordingState: action.payload,
      };
    default:
      return state;
  }
};

export default stateData;
