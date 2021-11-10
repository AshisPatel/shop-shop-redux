const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params).populate('category');
    },
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },

    checkout: async(parent, args, context) => {
      // this provides the base domain that the request came from (we're using apolloservers context to intercept the information about the headers on this request)
      // locally, this would be http://localhost:3001 -> since graphQL is running on port:3001
      const url = new URL(context.headers.referer).origin;

      // we pass our array of ids via args.products to create an instance of the Order model, which creates a purchaseDate(default: date.now) and the second paramter is the array of product id's which will be ObjectIds so mongoose can reference the Product models and build the full product from just the id.

      const order = new Order({ products: args.products });
      // here we use execPopulate because we are performing an operation on a specific instance of an Order model ('order')
      const { products } = await order.populate('products').execPopulate();
      const line_items = [];

      for(let i=0; i< products.length; i++) {
        // create product id by accessing the product object from the products variable => contains fully expanded data from the Product model
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          // we can include an image since we have access to the url where we are referring the users back to
          images: [`${url}/images/${products[i].image}`]
        });

        // create price id using the product id
        const price = await stripe.prices.create({
          product: product.id,
          // price is stored in cents not dollars so we have to multiply our stored dollar value by 100
          unit_amount: products[i].price * 100,
          currency: 'usd'
        });

        // add price id to the line items array 
        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${url}/success?session_ID={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}`
      });

      return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
