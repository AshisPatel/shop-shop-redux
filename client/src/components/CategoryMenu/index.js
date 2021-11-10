import React, { useEffect } from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from "../../utils/actions";
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {

  // useStoreContext will import global state and dispatch to be able to update the state
  const [state, dispatch] = useStoreContext();
  // destructure the categories key from the global state as its the only one you needed 
  const { categories } = state;
  // useQuery will obtain our category data from GraphQL
  const { data: categoryData, loading } = useQuery(QUERY_CATEGORIES);

  // useEffect will add data to our global state on component mount, and update of categoryData, or when dispatch is invoked
  useEffect(() => {
    // if categoryData exists, or has changed from the response of useQuery, then run the dispatch() action to UPDATE_CATEGORIES in the global state to match the new data
    if (categoryData) {
      // execute dispatch function with our action object indicating the type of action and then the updated state
      // NOTE: dispatch is sending the action parameter of the reducer function - thus the type object is read in the switch statement and the part of state that needs to be updated is sent in as the second arguement. In this case, it will be action.categories
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      // add category data to indexedDB store
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
      // check to see if the useQuery loading parameter exists, it will not if the user is offline and so we'll grab the data from the indexedDB store instead
    } else if (!loading) {
      idbPromise('categories', 'get').then(categoriesData => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categoriesData
        });
      });
    }
    // why does this run on dispatch update?
  }, [categoryData, dispatch, loading]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };


  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
