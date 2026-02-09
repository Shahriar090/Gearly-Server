import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeTemplateControllers } from './attribute.template.controllers';
import { attributeTemplateCreateSchema } from './attribute.template.validation';
const router = express.Router();

// create
router
	.route('/create-template')
	.post(validateRequest(attributeTemplateCreateSchema), AttributeTemplateControllers.createAttributeTemplate);

export const templateRoutes = router;
