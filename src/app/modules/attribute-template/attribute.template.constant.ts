import { ProductStatus } from '../productModel/productModel.interface';
import { AttributeType } from './attribute.template.interface';

export const ATTRIBUTE_TYPES = AttributeType;
export const PRODUCT_STATUS = ProductStatus;

export const CATEGORY_LEVELS = {
	ROOT: 0,
	SUB: 1,
	CHILD: 2,
} as const;
