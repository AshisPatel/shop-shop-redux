import React from 'react';
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../redux/cart";
import { idbPromise } from "../../utils/helpers";

const CartItem =({ item }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(removeFromCart(item._id));
        // mimic functionality to manage indexedDB cart store
        idbPromise('cart', 'delete', item);
    };

    // mimic functionality to manage indexedDB cart store
    const handleChange = (e) => {
        const { value } = e.target;

        if (value === '0') {
            dispatch(removeFromCart(item._id));
            idbPromise('cart', 'delete', item);
        } else {
            dispatch(updateCartQuantity(item._id, value));
            idbPromise('cart', 'put', {...item, purchaseQuantity: value});
        }
    }

    return (
        <div className="flex-row">
            <div>
                <img
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input 
                        type="number"
                        placeholder="1"
                        value={item.purchaseQuantity}
                        onChange = {handleChange}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => handleClick()}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem; 