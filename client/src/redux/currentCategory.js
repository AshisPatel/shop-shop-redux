export const setCurrentCategory = (category) => {
    return {
        type: "SET_CURRENT_CATEGORY",
        payload: category
    };
};

export default function currentCategoryReducer(currentCategory = '', { type, payload }) {
    switch(type) {
        case "SET_CURRENT_CATEGORY":
            return payload;
        default:
            return currentCategory; 
    }
};