import z from 'zod';

// Base objects
const attributeBaseObject = z.object({
	name: z.string().min(1, 'Attribute name is required'), // human readable (RAM)
	key: z
		.string()
		.min(1)
		.max(50)
		.regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters/underscores only'), // system safe identifier (ram_size)
	type: z.enum(['string', 'number', 'boolean', 'array', 'select', 'multiSelect']),
	unit: z.string().optional(), // unit for numbers (GB, KG)
	options: z.array(z.string()).optional(), // only for select/multiselect
	validations: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
			pattern: z.string().optional(),
			minLength: z.number().optional(),
			maxLength: z.number().optional(),
		})
		.optional(), // allowing custom validation rules per attribute. like RAM: min = 4, max = 64
	required: z.boolean().default(false), // must user fill it?
	filterable: z.boolean().default(false), // can it be used in filters?
	sortable: z.boolean().default(false), // can it be sorted?
});

// Refine function
// superRefine = Run custom logic after validation
function attributeRefine(attr: Partial<z.infer<typeof attributeBaseObject>>, ctx: z.RefinementCtx) {
	// options required for select/multiselect
	if ((attr.type === 'select' || attr.type === 'multiSelect') && (!attr.options || attr.options.length === 0)) {
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
// Update schema
export const attributeUpdateSchema = attributeBaseObject
	.partial()
	.superRefine(attributeRefine)
	.refine((obj) => Object.keys(obj).length > 0, {
		message: 'Attribute update cannot be empty',
	});

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

// 🔹 PATCH Schema (Main Part)
// this schema is for partial, granular updates (Patch) or simply modify specific parts.
export const attributeTemplatePatchSchema = z.object({
	body: z
		.object({
			templateId: z.string().min(1, 'TemplateId is required'),

			// 🔹 Update group fields (name, order)
			groupUpdates: z
				.array(
					z.object({
						groupId: z.string().min(1),
						data: z
							.object({
								groupName: z.string().optional(),
								order: z.number().int().nonnegative().optional(),
							})
							.refine((obj) => Object.keys(obj).length > 0, {
								message: 'Group update must contain at least one field',
							}),
					}),
				)
				.optional(),

			// 🔹 Update existing attributes
			attributeUpdates: z
				.array(
					z.object({
						groupId: z.string().min(1),
						attributeId: z.string().min(1),
						data: attributeUpdateSchema,
					}),
				)
				.optional(),

			// 🔹 Add new attributes
			addAttributes: z
				.array(
					z.object({
						groupId: z.string().min(1),
						attributes: z.array(attributeCreateSchema).min(1),
					}),
				)
				.optional(),

			// 🔹 Delete attributes
			deleteAttributes: z
				.array(
					z.object({
						groupId: z.string().min(1),
						attributeIds: z.array(z.string().min(1)).min(1),
					}),
				)
				.optional(),
		})
		.refine((data) => data.groupUpdates || data.attributeUpdates || data.addAttributes || data.deleteAttributes, {
			message: 'At least one update operation must be provided',
		}),
});
