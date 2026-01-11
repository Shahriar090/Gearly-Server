import { model, Schema } from 'mongoose';
import type { TWishList } from './wishlist.interface';

const wishListSchema = new Schema<TWishList>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
		],
	},
	{ timestamps: true },
);

// model
const WishList = model<TWishList>('WishList', wishListSchema);

export default WishList;
