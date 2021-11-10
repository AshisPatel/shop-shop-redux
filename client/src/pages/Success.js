import React, { useEffect } from "react";
import { useMutation } from '@apollo/client';
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations";
import { idbPromise } from "../utils/helpers";

const Success = () => {

    const [addOrder] = useMutation(ADD_ORDER);

    useEffect(() => {
        const saveOrder = async () => {
            // call async function of getting all the cart items that are saved in indexedDB
            const indexedCart = await idbPromise('cart', 'get');
            // convert these into an array of IDs that we will pass into addOrder mutation
            const orderedProducts = indexedCart.map(item => item._id);
            if(orderedProducts.length) {
                // addOrder mutation takes in an array of ID's and returns an Order object, which contains a key of products with all the product information and a purchase date
                const { data } = await addOrder({
                    variables: {products: orderedProducts}
                });
                // grab the products data from the returned data 
                const productData = data.addOrder.products; 
                // remove each item from the cart store in indexedDB since the order has been complete
                productData.forEach(item => {
                    idbPromise('cart', 'delete', item);
                });
            }

            setTimeout(() => {window.location.assign('/')}, 3000);
        };
        saveOrder();
        
    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
                <h1>Success!</h1>
                <h2>
                    Thank you for your purchase! 
                </h2>
                <h2>
                    You will now be redirected to the homepage. 
                </h2>
            </Jumbotron>
        </div>
    );
};

export default Success; 