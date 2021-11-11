export const updateCategories = (categories) => {
    return {
        type: 'UPDATE_CATEGORIES',
        payload: categories
    };
};

export default function categoriesReducer(categories = [], { type, payload }) {
    switch (type) {
        case "UPDATE_CATEGORIES":
            return [...payload];
        default: 
            return categories; 
    }
};