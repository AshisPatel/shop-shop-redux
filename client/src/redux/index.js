import redux, {createStore, applyMiddleware, combineReducers} from "redux";
// import reducers
import productsReducer from "./products";
import currentCategoryReducer from "./currentCategory";

const rootReducer = combineReducers({
    products: productsReducer,
    currentCategory: currentCategoryReducer
});

const store = createStore(rootReducer);
store.subscribe(() => console.log(store.getState()));
export default store; 