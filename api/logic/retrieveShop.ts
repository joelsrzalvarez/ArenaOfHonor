import {Shop} from '../data/index.ts'; 
import { SystemError } from 'com/errors';

async function retrieveShop() {
  try {
    const shop = await Shop.find();
    if (shop.length === 0) {
      console.log('No shop items found');
    } else {
      console.log('Shop items found:', shop);
    }
    return shop;
  } catch (error) {
    console.error('Error retrieving shop:', error); 
    throw new SystemError('Error retrieving shop: ' + error.message);
  }
}

export default retrieveShop;
