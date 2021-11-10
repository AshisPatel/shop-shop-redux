import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';

import { idbPromise } from '../../utils/helpers';

function ProductList() {
  const [state, dispatch] = useStoreContext();
  const { currentCategory, products } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // store data in global state
    if(data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      // store all data in IndexedDB
      data.products.forEach(product => {
        // structured as store, method, object
        idbPromise('products', 'put', product);
      })
      // if the user is not connected to the internet, the useQuery will never activate and therefore the loading parameter will never exist, so we can grab data from the indexedDB store instead ---> loading is falsey
    } else if(!loading) {
      idbPromise('products', 'get').then((products) => {
        // grab data from promise and set it to the global state for products
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
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
