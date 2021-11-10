import { useReducer } from 'react';

import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from './actions';

export const reducer = (state, action) => {
    switch(action.type) {
        // if action type value is the value of 'UPDATE_PRODUCTS', return a new state object with an updated projects array
        case UPDATE_PRODUCTS:
            // spread operator to return all other properties of state object
            return {
                ...state,
                products: [...action.products]
            };
        // if action type value is the value of 'UPDATE_CATEGORIES', return a new state object withan updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };
        // if action type is the value of 'UPDATE_CURRENT_CATEGORY', return the updated value of the currentCategory
        case UPDATE_CURRENT_CATEGORY: 
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        // if action is the value of'ADD_TO_CART', return the following: cartOpen is now true, cart array with added product
        case ADD_TO_CART: 
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        // if action is the value 'ADD_MULTIPLE_TO_CART', return the following: cart array includes all items in the added products
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.products]
            }
        // if action is the value 'REMOVE_FROM_CART', return the following: newState for cart where the item with the action.id has been removed
        case REMOVE_FROM_CART:
            let newState = state.cart.filter(product => 
                product._id !== action._id
            );

            return {
                ...state,
                cartOpen: newState.length > 0,
                cart: newState
            };
        // if the action is the value 'UPDATE_CART_QUANTITY', return the following: cartOpen is true, cart array with the product in the cart whose _id was passed updated to the new passed in purchaseQuantity
        case UPDATE_CART_QUANTITY: 
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map(product => {
                    if(product._id === action._id) {
                        product.purchaseQuantity = action.purchaseQuantity
                    }
                    return product; 
                })
            };
        // if the action is 'CLEAR_CART', toggleOff the cart and return an empty array for the cart
        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        // if the action is 'TOGGLE_CART', switch display from what it was
        case TOGGLE_CART: 
               

            return {
                ...state,
                cartOpen: !state.cartOpen
            };
        // if it's none of the cases, we will return the state without any updates
        default:
            return state; 
    }
};

// export reducer function so that it can be used by the global state
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}