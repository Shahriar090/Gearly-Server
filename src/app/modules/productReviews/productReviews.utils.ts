import { Product } from '../productModel/productModel.model';
import { Review } from './productReviews.model';

export const updateProductRatings = async (productId: string) => {
  try {
    // fetch all reviews for the product
    const reviews = await Review.find({ product: productId });

    // calculate the average rating
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    const averageRating = reviews.length ? totalRatings / reviews.length : 0;

    // update product's average rating
    await Product.findByIdAndUpdate(productId, { ratings: averageRating });

    return averageRating;
  } catch (error) {
    console.error('Error Updating Product Ratings', error);
  }
};
