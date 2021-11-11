export const updateProducts = (products) => {
    return {
        type: "UPDATE_PRODUCTS",
        payload: products
    }
}

export default function productsReducer(products = [], action){
    const { type, payload } = action; 
    switch (type) {
        case "UPDATE_PRODUCTS":
            return [...payload]
        default: 
            return products
    }
}