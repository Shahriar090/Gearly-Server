import { model, Schema } from 'mongoose';
import type {
	TCustomerInfo,
	TItems,
	TOrder,
	TOrderStatus,
	TPaymentMethod,
	TPaymentStatus,
	TDeliveryMethod,
} from './order.interface';
import { DELIVERY_METHODS, ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from './order.constants';

const itemSchema = new Schema<TItems>({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	quantity: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
	},
	discount: {
		type: Number,
		default: 0,
	},
	saved: {
		type: Number,
		default: 0,
	},

	totalPrice: {
		type: Number,
	},
});

const customerInfoSchema = new Schema<TCustomerInfo>({
	firstName: {
		type: String,
		required: true,
	},
	middleName: {
		type: String,
	},
	lastName: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	mobile: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	zone: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
	},
});

const orderSchema = new Schema<TOrder>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		trackingId: {
			type: String,
			unique: true,
		},
		items: [itemSchema],
		discount: {
			type: Number,
			default: 0,
		},
		totalSaved: {
			type: Number,
		},
		tax: {
			type: Number,
			default: 0,
		},
		shippingCharge: {
			type: Number,
			default: 0,
		},
		grandTotal: {
			type: Number,
		},
		orderStatus: {
			type: String,
			enum: Object.values(ORDER_STATUS) as TOrderStatus[],
			default: ORDER_STATUS.Pending,
		},
		paymentStatus: {
			type: String,
			enum: Object.values(PAYMENT_STATUS) as TPaymentStatus[],
			default: PAYMENT_STATUS.Pending,
		},
		paymentMethod: {
			type: String,
			enum: Object.values(PAYMENT_METHODS) as TPaymentMethod[],
		},
		deliveryMethod: {
			type: String,
			enum: Object.values(DELIVERY_METHODS) as TDeliveryMethod[],
		},
		customerInfo: customerInfoSchema,
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

// static method to check if the order is completed
orderSchema.statics.isOrderCompleted = async function (orderId: string) {
	const order = await this.findById(orderId);
	return order?.status === ORDER_STATUS.Confirmed;
};

// static method to update payment status
orderSchema.statics.updatePaymentStatus = async function (orderId: string, status: TPaymentStatus) {
	const order = await this.findById(orderId);
	if (order) {
		order.paymentStatus = status;
		await order.save();
	}
};

// Pre find hook to exclude deleted orders
orderSchema.pre('find', function (next) {
	this.where({ isDeleted: { $ne: true } });
	next();
});

// Pre findOne hook to exclude deleted orders
orderSchema.pre('findOne', function (next) {
	this.where({ isDeleted: { $ne: true } });
	next();
});

// model
export const Order = model<TOrder>('Order', orderSchema);
