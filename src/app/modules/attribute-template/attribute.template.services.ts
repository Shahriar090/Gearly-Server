// create attribute template

import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Category } from '../category/category.model';
import { TAttributeTemplate } from './attribute.template.interface';
import { AttributeTemplate } from './attribute.template.model';

const createAttributeTemplateIntoDb = async (payload: TAttributeTemplate) => {
	const { categoryId } = payload;

	// check if the category is exist or not
	const category = await Category.findById(categoryId);
	if (!category) {
		throw new AppError(httpStatus.NOT_FOUND, 'No Category Found', 'NoCategoryFound');
	}

	// check if the category is a root category of a sub category
	if (!category.parentId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			'Attribute template cannot be created for root categories',
			'RootCategory',
		);
	}

	// check if the template is already exist or not
	const isTemplateExist = await AttributeTemplate.findOne({ categoryId });

	if (isTemplateExist) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			'Attribute template already exists for this category',
			'TemplateAlreadyExist',
		);
	}

	// check if the attribute group is empty or not
	if (!payload.groups || payload.groups.length === 0) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			'Attribute template must have at least one group',
			'EmptyAttributeTemplate',
		);
	}

	// create a new template
	return await AttributeTemplate.create(payload);
};

export const AttributeTemplateServices = {
	createAttributeTemplateIntoDb,
};
