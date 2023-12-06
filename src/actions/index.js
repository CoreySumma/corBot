export const UPDATE_RECORDING_STATE = 'UPDATE_RECORDING_STATE';


// Action Creators
export const updateRecordingState = (recordingState) => {
  return {
    type: UPDATE_RECORDING_STATE,
    payload: recordingState,
  };
};