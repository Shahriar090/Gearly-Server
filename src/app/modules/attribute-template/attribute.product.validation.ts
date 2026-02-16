import { z } from 'zod';
import { AttributeType, TAttribute, TAttributeTemplate, ValidationResult } from './attribute.template.interface';

// create zod schema for a singlel attribute

export const createAttributeSchema = (attr: TAttribute) => {
	const { type, required, validations, options, name } = attr;

	switch (type) {
		case AttributeType.STRING: {
			let schema = z.string({
				invalid_type_error: `${name} must be a string`,
			});

			if (validations?.minLength !== undefined) {
				schema = schema.min(validations.minLength, `${name} must be at least ${validations.minLength} characters`);
			}

			if (validations?.maxLength !== undefined) {
				schema = schema.max(validations.maxLength, `${name} must not exceed ${validations.maxLength} characters`);
			}

			if (validations?.pattern) {
				schema = schema.regex(new RegExp(validations.pattern), `${name} format is invalid`);
			}

			return required ? schema : schema.optional();
		}

		case AttributeType.NUMBER: {
			let schema = z.number({
				invalid_type_error: `${name} must be a number`,
			});

			if (validations?.min !== undefined) {
				schema = schema.min(validations.min, `${name} must be at least ${validations.min}`);
			}

			if (validations?.max !== undefined) {
				schema = schema.max(validations.max, `${name} must not exceed ${validations.max}`);
			}

			return required ? schema : schema.optional();
		}

		case AttributeType.BOOLEAN: {
			const schema = z.boolean({
				invalid_type_error: `${name} must be a boolean`,
			});

			return required ? schema : schema.optional();
		}

		case AttributeType.ARRAY: {
			let schema = z.array(z.any(), {
				invalid_type_error: `${name} must be an array`,
			});

			if (validations?.min !== undefined) {
				schema = schema.min(validations.min, `${name} must contain at least ${validations.min} items`);
			}

			if (validations?.max !== undefined) {
				schema = schema.max(validations.max, `${name} must not contain more than ${validations.max} items`);
			}

			return required ? schema : schema.optional();
		}

		case AttributeType.SELECT: {
			if (!options || options.length === 0) {
				throw new Error(`${name} must have options defined`);
			}

			const schema = z.enum(options as [string, ...string[]], {
				errorMap: () => ({
					message: `${name} must be one of: ${options.join(', ')}`,
				}),
			});

			return required ? schema : schema.optional();
		}

		case AttributeType.MULTI_SELECT: {
			if (!options || options.length === 0) {
				throw new Error(`${name} must have options defined`);
			}

			let schema = z.array(
				z.enum(options as [string, ...string[]], {
					errorMap: () => ({
						message: `Each ${name} value must be one of: ${options.join(', ')}`,
					}),
				}),
				{
					invalid_type_error: `${name} must be an array`,
				},
			);

			if (validations?.min !== undefined) {
				schema = schema.min(validations.min, `${name} must contain at least ${validations.min} selections`);
			}

			if (validations?.max !== undefined) {
				schema = schema.max(validations.max, `${name} must not contain more than ${validations.max} selections`);
			}

			return required ? schema : schema.optional();
		}

		default:
			throw new Error(`Unknown attribute type: ${type}`);
	}
};

export const validateAttributes = (attributes: Record<string, any>, template: TAttributeTemplate): ValidationResult => {
	try {
		// build dynamic schema from template
		const schemaShape: Record<string, z.ZodTypeAny> = {};

		template.groups.forEach((group) => {
			group.attributes.forEach((attr) => {
				schemaShape[attr.key] = createAttributeSchema(attr);
			});
		});

		const attributesSchema = z.object(schemaShape).strict();

		// validate and parse
		const sanitizedAttributes = attributesSchema.parse(attributes);

		return {
			isValid: true,
			errors: [],
			sanitizedAttributes,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.errors.map((err) => ({
				field: err.path.join('.'),
				message: err.message,
			}));

			return {
				isValid: false,
				errors,
			};
		}

		throw error;
	}
};
