import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import {useSelector, useDispatch} from "react-redux";
import { updateProducts } from '../../redux/products';
import { idbPromise } from '../../utils/helpers';
import ProductItem from '../ProductItem';
import spinner from '../../assets/spinner.gif';

function ProductList() {

  const products = useSelector(state => state.products);
  const currentCategory = useSelector(state => state.currentCategory);
  const dispatch = useDispatch();

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // store data in global state
    if(data) {
      dispatch(updateProducts(data.products));
      // store all data in IndexedDB
      data.products.forEach(product => {
        // structured as store, method, object
        idbPromise('products', 'put', product);
      })
      // if the user is not connected to the internet, the useQuery will never activate and therefore the loading parameter will never exist, so we can grab data from the indexedDB store instead ---> loading is falsey
    } else if(!loading) {
      idbPromise('products', 'get').then((products) => {
        // grab data from promise and set it to the global state for products
        dispatch(updateProducts(products));
      });
    }
    
  }, [dispatch, loading, data]);

  function filterProducts() {
    if(!currentCategory) {
      return products; 
    }

    return products.filter(product => product.category._id === currentCategory);
  }


  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
