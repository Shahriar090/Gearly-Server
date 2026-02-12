import { TAttributeTemplate } from '../attribute-template/attribute.template.interface';
import { AttributeTemplate } from '../attribute-template/attribute.template.model';
import { TCategory } from '../category/category.interface';
import { Category } from '../category/category.model';
import { CreateProductInput, TProductModel } from './productModel.interface';
import { Product } from './productModel.model';

// find category by id
export const findCategoryById = async (categoryId: string): Promise<TCategory | null> => {
	return await Category.findById(categoryId);
};

// find attribute template by id

export const findAttributeTemplateById = async (templateId: string): Promise<TAttributeTemplate | null> => {
	return await AttributeTemplate.findById(templateId);
};

// create new product
export const createNewProduct = async (payload: CreateProductInput): Promise<TProductModel> => {
	const product = new Product(payload);
	return await product.save();
};
