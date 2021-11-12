import redux, {createStore, applyMiddleware, combineReducers} from "redux";
// import reducers
import productsReducer from "./products";
import currentCategoryReducer from "./currentCategory";
import categoriesReducer from "./categories";
import cartReducer from "./cart";

const rootReducer = combineReducers({
    products: productsReducer,
    currentCategory: currentCategoryReducer,
    categories: categoriesReducer,
    cart: cartReducer
});

const store = createStore(rootReducer);
store.subscribe(() => console.log(store.getState()));
export default store; 