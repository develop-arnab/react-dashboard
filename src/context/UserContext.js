import React from "react";
import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("VAL", login, password);
  if (!!login && !!password) {
    try {
      const body = {
        username: login,
        password: password,
      };
      axios.post(`http://3.6.37.30:8080/server/auth/login`, body).then((res) => {
        console.log("SUCCESS", res)
        if (res.data.status === "Success"){
          
          localStorage.setItem("id_token", 1);
          setError(null);
          setIsLoading(false);
          dispatch({ type: "LOGIN_SUCCESS" });
  
          history.push("/app/dashboard");
          console.log("ON LOGIN", res);
        } else {
          // dispatch({ type: "LOGIN_FAILURE" });
          setError(true);
          setIsLoading(false);
          console.log("Incorrect username or password");
        }

      });
    } catch (err) {
      console.log("ERROR HAS OCCURED", err);
    }
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
