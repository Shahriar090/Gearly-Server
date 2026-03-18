import z from 'zod';

// Base objects
const attributeBaseObject = z.object({
	name: z.string().min(1, 'Attribute name is required'),
	key: z.string().regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters/underscores only'),
	type: z.enum(['string', 'number', 'boolean', 'array', 'select', 'multiSelect']),
	unit: z.string().optional(),
	options: z.array(z.string()).optional(),
	validations: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
			pattern: z.string().optional(),
			minLength: z.number().optional(),
			maxLength: z.number().optional(),
		})
		.optional(),
	required: z.boolean().default(false),
	filterable: z.boolean().default(false),
	sortable: z.boolean().default(false),
});

// Refine function
function attributeRefine(attr: any, ctx: z.RefinementCtx) {
	// options required for select/multiselect
	if ((attr.type === 'select' || attr.type === 'multiselect') && (!attr.options || attr.options.length === 0)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['options'],
			message: 'Options are required for select and multiSelect types',
		});
	}

	// options not allowed otherwise
	if (attr.options && attr.type !== 'select' && attr.type !== 'multiSelect') {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['options'],
			message: 'Options are only allowed for select or multiSelect types',
		});
	}

	// unit only for number
	if (attr.unit && attr.type !== 'number') {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['unit'],
			message: 'Unit is allowed only for number type',
		});
	}
}

//  Create schema
export const attributeCreateSchema = attributeBaseObject.superRefine(attributeRefine);
export const attributeUpdateSchema = attributeBaseObject.partial().superRefine(attributeRefine);

// Groups
const groupBaseObject = z.object({
	groupName: z.string().min(1),
	order: z.number().int().nonnegative(),
	attributes: z.array(attributeBaseObject).min(1),
});

export const attributeGroupCreateSchema = groupBaseObject;
export const attributeGroupUpdateSchema = groupBaseObject.partial({});

// Templates
const templateBaseObject = z.object({
	categoryId: z.string().min(1, 'CategoryId is required'),
	name: z.string().min(1),
	groups: z.array(groupBaseObject).min(1),
});

export const attributeTemplateCreateSchema = z.object({
	body: z.object({
		template: templateBaseObject,
	}),
});

export const attributeTemplateUpdateSchema = z.object({
	body: z.object({
		template: templateBaseObject.partial({}),
	}),
});
