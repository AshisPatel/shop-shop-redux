export const toggleCart = () => {
    return {
        type: "TOGGLE_CART"
    };
};

export const addToCart = (product) => {
    return {
        type: "ADD_TO_CART",
        payload: product
    };
};

export const addMultipleToCart = (products) => {
    return {
        type: "ADD_MULTPLE_TO_CART",
        payload: products
    };
};

export const removeFromCart = (_id) => {
    return {
        type: "REMOVE_FROM_CART",
        payload: _id
    };
};

export const updateCartQuantity = (_id, purchaseQuantity) => {
    return {
        type: "UPDATE_CART_QUANTITY",
        payload: {_id, purchaseQuantity}
    };
};

export const clearCart = () => {
    return {
        type: "CLEAR_CART"
    };
};

const initialState = {
    cartOpen: false,
    cart: []
};

export default function cartReducer(cart = initialState, {type, payload}) {
    switch (type) {
        case "TOGGLE_CART":
            return {
                ...cart,
                cartOpen: !cart.cartOpen
            };
        case "CLEAR_CART":
            return {
                cart: [],
                cartOpen: false
            };
        case "ADD_TO_CART": 
            return {
                cart: [...cart.cart, payload],
                cartOpen: true
            };
        case "ADD_MULTIPLE_TO_CART":
            return {
                cart: [...cart.cart, payload],
                cartOpen: true
            };
        case "REMOVE_FROM_CART":
            const newCart = cart.cart.filter(product => product._id !== payload)
            return {
                cart: newCart,
                cartOpen: newCart.length > 0
            };
        case "UPDATE_CART_QUANTITY":

            return {
                ...cart, 
                cart: cart.cart.map(product =>{
                    if(product._id === payload._id) {
                        product.purchaseQuantity = payload.purchaseQuantity
                    }
                    return product; 
                })
            }
        default: 
            return cart;
    }
}