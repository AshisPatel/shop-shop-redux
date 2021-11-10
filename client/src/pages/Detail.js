import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_PRODUCTS, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART } from "../utils/actions";

import Cart from "../components/Cart";

import { idbPromise } from "../utils/helpers";

function Detail() {
  const { id } = useParams();
  const [state, dispatch] = useStoreContext();
  const { products, cart } = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const [currentProduct, setCurrentProduct] = useState({});

  // Check to see if the products in globalState is not empty
  // If it is not, then find the product that matches the id in the route and set that to the current product so that it will be displayed
  // if the globalState is empty and the query is complete, set the products in the globalState equal to the data from querying our DB

  // products would be empty if this was the first page that a user visited on the webpage ---> why we need to query 
  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
      // store the products data to indexedDB
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
      // if the user is offline the loading parameter will not exist, and we'll need to populate our global state using indexedDB
    } else if (!loading) {
      idbPromise('products', 'get').then(indexedProducts => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
  }, [products, data, loading, dispatch, id]);


  const addToCart = () => {
    // check if item is already in cart and call the appropraite action 
    // can either use currentProduct._id or id from useParams as they will be the same, perhaps better to use id it's cleaner?
    const itemInCart = cart.find(cartItem => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: itemInCart.purchaseQuantity + 1
      })
      // pass in a put request to indexedDB to upate the product in the cart store with the updated quantity of the item
      // The third arguement is the object we are sending to the store, therefore we destructure our itemInCart to contain all the other old parameters, and include our new purchaseQuantity key
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: itemInCart.purchaseQuantity + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
      // if product is not in cart, add the currentProduct with a purchaseQuantity of 1
      idbPromise('cart', 'put', {
        ...currentProduct,
        purchaseQuantity: 1
      });
    }
  };

  // removes all of those items from the cart 
  const removeFromCart = () => {
    // once again, can use id or currentProduct._id
    dispatch({
      type: REMOVE_FROM_CART,
      _id: id
    });
    // also remove the item from the indexedDB cart store
    idbPromise('cart', 'delete', currentProduct);

    console.log(cart);
  }

return (
  <>
    {currentProduct ? (
      <div className="container my-1">
        <Link to="/">← Back to Products</Link>

        <h2>{currentProduct.name}</h2>

        <p>{currentProduct.description}</p>

        <p>
          <strong>Price:</strong>${currentProduct.price}{' '}
          <button onClick={addToCart}>Add to Cart</button>
          <button 
            onClick={removeFromCart}
            disabled={!cart.some(cartItem => cartItem._id === currentProduct._id)}
          >
            Remove from Cart
          </button>
        </p>

        <img
          src={`/images/${currentProduct.image}`}
          alt={currentProduct.name}
        />
      </div>
    ) : null}
    {loading ? <img src={spinner} alt="loading" /> : null}
    <Cart />
  </>
);
}

export default Detail;
