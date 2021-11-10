// import actions 
import {
    UPDATE_CATEGORIES,
    UPDATE_PRODUCTS,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from "../utils/actions";

// import reducers
import { reducer } from "../utils/reducers";

// create an example of the global state
const initialState = {
    products: [],
    categories: [{ name: 'Food' }],
    currentCategory: '1',
    cart: [
        {
            _id: '1',
            name: 'Soup',
            purchaseQuantity: 1
        },
        {
            _id: '2',
            name: 'Bread',
            purchaseQuantity: 2
        }
    ],
    cartOpen: false
};

// test to see if products can be added to the products state variable
// General format is to provide the type of action that we are going to perform, and the result of the state after the action
test('UPDATE_PRODUCTS', () => {
    let newState= reducer(initialState, {
        type: UPDATE_PRODUCTS,
        products: [{}, {}]
    });

    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
});

// test to see if categories can be added to the categories state variable

test('UPDATE_CATEGORIES', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CATEGORIES,
        categories: [{}, {}]
    });

    expect(newState.categories.length).toBe(2);
    expect(initialState.categories.length).toBe(1);
});

// test to see if the current category can be updated

test('UPDATE_CURRENT_CATEGORY', () => {
    let newState= reducer(initialState, {
        type: UPDATE_CURRENT_CATEGORY,
        currentCategory: '2'
    });
    
    expect(newState.currentCategory).toBe('2');
    expect(initialState.currentCategory).toBe('1');
});
// product is what is getting added to cart (action.product) in the dispatch function will show up in the reducer
test('ADD_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_TO_CART,
        product: { purchaseQuantity: 1 }
    });
    
    expect(newState.cart.length).toBe(3);
    expect(initialState.cart.length).toBe(2);
});

test('ADD_MULTIPLE_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_MULTIPLE_TO_CART,
        products: [{}, {}]
    });

    expect(newState.cart.length).toBe(4);
    expect(initialState.cart.length).toBe(2);
});

// this will send the id of the product that we want to remove from the cart as our action
test('REMOVE_FROM_CART', () => {
    let newState1 = reducer(initialState, {
        type: REMOVE_FROM_CART,
        _id: '1'
    });
    
    // cart is still open
    expect(newState1.cartOpen).toBe(true);

    // the second item will be the first item 
    expect(newState1.cart.length).toBe(1);
    expect(newState1.cart[0]._id).toBe('2');

    // full empty the cart
    let newState2 = reducer(newState1, {
        type: REMOVE_FROM_CART,
        _id: '2'
    });

    // cart will close
    expect(newState2.cartOpen).toBe(false);
    expect(newState2.cart.length).toBe(0);

    expect(initialState.cart.length).toBe(2);
});

// take in _id of product in card and change its purchaseQuantity value
test('UPDATE_CART_QUANTITY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CART_QUANTITY,
        _id: '1',
        purchaseQuantity: 3
    });
    // adding another item in the cart will cause the cart to open 
    expect(newState.cartOpen).toBe(true);
    // the quantity of the second object should not be changed 
    expect(newState.cart[0].purchaseQuantity).toBe(3);
    expect(newState.cart[1].purchaseQuantity).toBe(2);

    expect(initialState.cartOpen).toBe(false);
});

// remove all products from the cat
test('CLEAR_CART', () => {
    let newState = reducer(initialState, {
        type: CLEAR_CART
    });

    expect(newState.cartOpen).toBe(false);
    expect(newState.cart.length).toBe(0);
    expect(initialState.cart.length).toBe(2);
});

// toggle cart display on and off
test('TOGGLE_CART', () => {
    let newState1 = reducer(initialState, {
        type: TOGGLE_CART,
    });

    expect(newState1.cartOpen).toBe(true);
    expect(initialState.cartOpen).toBe(false);

    let newState2 = reducer(newState1, {
        type: TOGGLE_CART
    });

    expect(newState2.cartOpen).toBe(false);
    expect(initialState.cartOpen).toBe(false);
});
