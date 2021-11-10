import React from "react";
import { Link } from "react-router-dom";
import { idbPromise, pluralize } from "../../utils/helpers";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";

function ProductItem(item) {

  const [state, dispatch] = useStoreContext();

  const { cart } = state; 

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const addToCart = () => {
    // check to see if item is in cart
    const itemInCart = cart.find(cartItem => cartItem._id === item._id);
    
    // if item exists, update cart quantity by passing in the item._id that we are clicking, and also add 1 to the item's current purchaseQuantity
    if(itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id, 
        purchaseQuantity: itemInCart.purchaseQuantity + 1
      }) 
      // mimic request but for indexedDB
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: itemInCart.purchaseQuantity + 1
      });
      // else add item to card with purchaseQuantity of 1
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      // mimic request for indexedDB
      idbPromise('cart', 'put', {
        ...item, 
        purchaseQuantity: 1
      });
    }
    
   
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
