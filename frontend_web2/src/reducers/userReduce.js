// reducers/userReducer.js
const initialState = {
    user_data: "guest",
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "USER":
        return { ...state, user_data: action.value };
      default:
        return state;
    }
  };
  
  export default userReducer;
  