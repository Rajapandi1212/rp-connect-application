import CustomError from '../errors/custom.error';
import { Resource } from '../interfaces/resource.interface';

const isLineItemslimitExceeded = (lineItems: any[] = []) => {
  return lineItems.length > 3;
}

/**
 * Handle the create action
 *
 * @param {Resource} resource The resource from the request body
 * @returns {object}
 */
const create = async (resource: Resource) => {

  try {

    // Deserialize the resource to a CartDraft
    const cartDraft = JSON.parse(JSON.stringify(resource));

    const shouldCreate = !isLineItemslimitExceeded(cartDraft?.obj?.lineItems)
    if(shouldCreate){
    return { statusCode: 200, actions: [] };
    }
    
return { statusCode: 400, error:{message:"Lineietms limit (3) exceeded. Please remove some items from the cart."} };
    
  } catch (error) {
    // Retry or handle the error
    // Create an error object
    if (error instanceof Error) {
      throw new CustomError(
        500,
        `Internal server error on CartController: ${error.stack}`
      );
    }
  }
};

// Controller for update actions
const update = (resource: Resource) => {
  try {
    const cartDraft = JSON.parse(JSON.stringify(resource));

    const shouldCreate = !isLineItemslimitExceeded(cartDraft?.obj?.lineItems)
    if(shouldCreate){
    return { statusCode: 200, actions: [] };
    }

    return { statusCode: 400, error:{message:"Lineietms limit (3) exceeded. Please remove some items from the cart."} };

  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(
        500,
        `Internal server error on CartController: ${error.stack}`
      );
    }
  }
};

/**
 * Handle the cart controller according to the action
 *
 * @param {string} action The action that comes with the request. Could be `Create` or `Update`
 * @param {Resource} resource The resource from the request body
 * @returns {Promise<object>} The data from the method that handles the action
 */
export const cartController = async (action: string, resource: Resource) => {
  switch (action) {
    case 'Create': {
      const data = create(resource);
      return data;
    }
    case 'Update':
      const data = update(resource);
      return data;

    default:
      throw new CustomError(
        500,
        `Internal Server Error - Resource not recognized. Allowed values are 'Create' or 'Update'.`
      );
  }
};
