import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeTemplateControllers } from './attribute.template.controllers';
import { attributeTemplateCreateSchema, attributeTemplatePatchSchema } from './attribute.template.validation';
const router = express.Router();

// create
router
	.route('/create-template')
	.post(validateRequest(attributeTemplateCreateSchema), AttributeTemplateControllers.createAttributeTemplate);

// update
router
	.route('/update')
	.patch(validateRequest(attributeTemplatePatchSchema), AttributeTemplateControllers.updateAttributeTemplate);

// get all attribute templates
router.route('/').get(AttributeTemplateControllers.getAllAttributeTemplates);

// get a single attribute template
router.route('/:templateId').get(AttributeTemplateControllers.getSingleAttributeTemplate);

export const templateRoutes = router;
