import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

const CartItem =({ item }) => {
    const [state, dispatch] = useStoreContext();

    const removeFromCart = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
        // mimic functionality to manage indexedDB cart store
        idbPromise('cart', 'delete', item);
    };

    // mimic functionality to manage indexedDB cart store
    const handleChange = (e) => {
        const { value } = e.target;

        if (value === '0') {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });
            idbPromise('cart', 'delete', item);
        } else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: value
            });
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
                        onClick={() => removeFromCart()}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem; 