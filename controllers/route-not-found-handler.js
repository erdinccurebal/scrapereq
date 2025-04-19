/**
 * 404 - Not Found page
 * Customized to hide Express framework information
 */

export default (_req, _res, next) => {
  try {
    throw new Error('Route Not Found!');
  } catch (error) {
    next(error);
  }
};