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

export const AttributeTemplateControllers = {
	createAttributeTemplate,
};
