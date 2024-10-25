import {combineReducers} from "redux";
import userReducer from "./userReducer";
import alertReducer from "./alertReducer";
import productReducer from "./productReducer";
import allUserReducer from "./allUserReducer";
import cartReducer from "./cartReducer";
import displayCartReducer from "./displayCartReducer";
import ordersReducer from "./orderReducer";

const myReducers = combineReducers({
    user: userReducer,
    alert: alertReducer,
    products : productReducer,
    allUsers: allUserReducer,
    cart : cartReducer,
    isCart: displayCartReducer,
    orders: ordersReducer,
});

export default myReducers;