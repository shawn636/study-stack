import { memoizeFunction } from './util';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const getStripe = memoizeFunction(() => new Stripe(STRIPE_SECRET_KEY));
export const stripe = getStripe();
