import httpStatus from 'http-status';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { AttributeTemplateServices } from './attribute.template.services';

const createAttributeTemplate = asyncHandler(async (req, res) => {
	const { template } = req.body;
	const result = await AttributeTemplateServices.createAttributeTemplateIntoDb(template);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Template Created Successfully',
		data: result,
	});
});

// update attribute template
const updateAttributeTemplate = asyncHandler(async (req, res) => {
	const result = await AttributeTemplateServices.updateAttributeTemplateIntoDb(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Attribute template updated successfully',
		data: result,
	});
});

// get all attribute templates from db
const getAllAttributeTemplates = asyncHandler(async (req, res) => {
	const query = req.query;

	const result = await AttributeTemplateServices.getAllAttributeTemplatesFromDb(query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'All attribute templates are retrieved successfully',
		data: result,
	});
});

export const AttributeTemplateControllers = {
	createAttributeTemplate,
	updateAttributeTemplate,
	getAllAttributeTemplates,
};
