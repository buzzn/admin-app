export default function reducer(state={
    groups: [],
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch(action.type){
      case "FETCH_GROUPS": {
        return {...state, feching: true}
      }
      case "FETCH_GROUPS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_GROUPS_FULFILLED": {
        console.log( action.payload);
        return {...state, fetching: false, fetched: true, groups: action.payload.data }
      }
      default: {
        return state
      }
    }

}
