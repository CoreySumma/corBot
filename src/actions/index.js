export const UPDATE_LOADING_RESPONSE = 'UPDATE_LOADING_RESPONSE';


// Action Creators
export const updateLoadingResponse = (loading) => {
  return {
    type: UPDATE_LOADING_RESPONSE,
    payload: loading,
  };
};