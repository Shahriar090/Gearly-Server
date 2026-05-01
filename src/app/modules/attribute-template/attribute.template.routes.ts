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
router.route('/template/:templateId').get(AttributeTemplateControllers.getSingleAttributeTemplate);

// get attribute template by category
router.route('/category/:categoryId').get(AttributeTemplateControllers.getAttributeTemplateByCategory);
// TODO: There was an error about this catch-all dynamic route
// Explore more about it later.

// delete template
router.route('/delete/:templateId').delete(AttributeTemplateControllers.deleteAttributeTemplate);

export const templateRoutes = router;
