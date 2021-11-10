import React, { createContext, useContext } from "react";
import { useProductReducer } from "./reducers";

// create our contextProvider
// A provider function that takes in state variables as props and make those variables available to other components (to it's consumers)
const StoreContext = createContext();
const { Provider } = StoreContext;

// useProductReducer takes in the initial state as an arguement and wraps around useReducer
// useReducer takes in the reducer function and the initial state
// the reducer function contains our switch statement that takes in our current state and action and returns the new version of state
// thus our [state, dispatch] is actually the most current version of state and then the action that we're going to use to update state
const StoreProvider = ({ value = [], ...props }) => {

    // The end goal of this file is to provide an object similair to useState
    // In common usage => [state, setState] = useState(initialState)
    // This is all we are doing by providing [globalState, setGlobalState] = useState(initialState)
    // It's just formatted as [state, dispatch] = useProductReducer(initialState);
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false, 
        categories: [],
        currentCategory: ''
    });
    // check state
    console.log(state);
    // Once the useProductReducer is completed, we will pass in the current version of state and the function to edit the state (dispatch) as in the value prop
    // This can then be accessed by any consumers of the Provider
    // We include {...props} because everything wrapped by the StoreProvider is it's child and needs to be returned (all the other props in the app will be the StoreProvider's children)h
    return <Provider value={[state, dispatch]} {...props} />;
};

// useContext allows us to create a custom functionthat will pass on all the props or functionality that StoreProvider has to any component that needs it
const useStoreContext = () => {
    return useContext(StoreContext);
}

export { StoreProvider, useStoreContext };

