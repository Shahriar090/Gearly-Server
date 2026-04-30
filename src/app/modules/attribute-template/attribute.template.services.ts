// create attribute template

import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Category } from '../category/category.model';
import { updateCategoryAttributeTemplate } from '../category/category.utils';
import { TAttributeTemplate } from './attribute.template.interface';
import { AttributeTemplate } from './attribute.template.model';

// create attribute template
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
	const template = new AttributeTemplate(payload);

	await template.save();

	await updateCategoryAttributeTemplate(categoryId.toString(), template._id.toString());

	return template;
};

// update attribute template
const updateAttributeTemplateIntoDb = async (payload: any) => {
	const { templateId, groupUpdates, attributeUpdates, addAttributes, deleteAttributes } = payload;

	// check template exists
	const template = await AttributeTemplate.findById(templateId);

	if (!template) {
		throw new AppError(httpStatus.NOT_FOUND, 'Attribute template not found', 'TemplateNotFound');
	}

	// handle group updates
	if (groupUpdates) {
		for (const update of groupUpdates) {
			const group = template.groups.find((group) => group._id?.toString() === update.groupId);

			if (!group) {
				throw new AppError(httpStatus.NOT_FOUND, 'Group not found', 'GroupNotFound');
			}

			Object.assign(group, update.data);
		}
	}

	// handle attribute updates
	if (attributeUpdates) {
		for (const update of attributeUpdates) {
			const group = template.groups.find((group) => group._id?.toString() === update.groupId);

			if (!group) {
				throw new AppError(httpStatus.NOT_FOUND, 'Group not found', 'GroupNotFound');
			}

			const attribute = group.attributes.find((attr) => attr._id?.toString() === update.attributeId);

			if (!attribute) {
				throw new AppError(httpStatus.NOT_FOUND, 'Attribute not found', 'AttributeNotFound');
			}

			Object.assign(attribute, update.data);
		}
	}

	// handle add attributes

	if (addAttributes) {
		for (const item of addAttributes) {
			const group = template.groups.find((group) => group._id?.toString() === item.groupId);

			if (!group) {
				throw new AppError(httpStatus.NOT_FOUND, 'Group not found', 'GroupNotFound');
			}

			group.attributes.push(...item.attributes);
		}
	}

	// handle delete attributes
	if (deleteAttributes) {
		for (const item of deleteAttributes) {
			const group = template.groups.find((group) => group._id?.toString() === item.groupId);

			if (!group) {
				throw new AppError(httpStatus.NOT_FOUND, 'Group not found', 'GroupNotFound');
			}

			group.attributes = group.attributes.filter((attr) => !item.attributeIds.includes(attr._id?.toString()));
		}
	}

	// save updated doc
	await template.save();
	return template;
};

// get all attribute templates
const getAllAttributeTemplatesFromDb = async (query: any) => {
	const { page = 1, limit = 10, categoryId } = query;

	const filter: any = {};

	if (categoryId) {
		filter.categoryId = categoryId;
	}

	const result = await AttributeTemplate.find(filter)
		.skip((page - 1) * limit)
		.limit(limit)
		.populate('categoryId');
	const total = await AttributeTemplate.countDocuments(filter);

	return {
		meta: {
			page,
			limit,
			total,
		},
		data: result,
	};
};

// get a single attribute template
const getSingleAttributeTemplateFromDb = async (templateId: string) => {
	const template = await AttributeTemplate.findById(templateId).populate('categoryId');

	if (!template) {
		throw new AppError(404, 'Attribute template not found', 'TemplateNotFound');
	}

	return template;
};

// get attribute template by category
const getAttributeTemplateByCategoryFromDb = async (categoryId: string) => {
	const template = await AttributeTemplate.findOne({ categoryId });

	if (!template) {
		throw new AppError(404, 'No template found for this category', 'TemplateNotFound');
	}

	return template;
};

// soft delete
const deleteAttributeTemplateFromDb = async (templateId: string) => {
	const template = await AttributeTemplate.findByIdAndUpdate(templateId, { isDeleted: true }, { new: true });

	if (!template) {
		throw new AppError(404, 'Template not found', 'TemplateNotFound');
	}

	return template;
};

export const AttributeTemplateServices = {
	createAttributeTemplateIntoDb,
	updateAttributeTemplateIntoDb,
	getAllAttributeTemplatesFromDb,
	getSingleAttributeTemplateFromDb,
	getAttributeTemplateByCategoryFromDb,
	deleteAttributeTemplateFromDb,
};
