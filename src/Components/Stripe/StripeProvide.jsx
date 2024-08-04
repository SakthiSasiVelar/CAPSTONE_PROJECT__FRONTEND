import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PfcWZLiML4FoutcjLdEfWZEZtNEpr5YSqNKBAhSSjUXLCE4IY45o3hQ7siPqkhjZ3hZwxZ4UIoi2Ct4JoSgzXLl002aZUmo8Y'); 

const StripeProvider = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
);

export default StripeProvider;
