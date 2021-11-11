import redux, {createStore, applyMiddleware, combineReducers} from "redux";
// import reducers
import productsReducer from "./products";
console.log(productsReducer); 

const rootReducer = combineReducers({
    products: productsReducer
});

const store = createStore(rootReducer);
store.subscribe(() => console.log(store.getState()));
export default store; 