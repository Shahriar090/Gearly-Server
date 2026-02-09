import z from 'zod';

// Base objects
const attributeBaseObject = z.object({
	name: z.string().min(1, 'Attribute name is required'),
	key: z.string().regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters/underscores only'),
	type: z.enum(['string', 'number', 'boolean', 'enum']),
	unit: z.string().optional(),
	enumValues: z.array(z.string()).optional(),
	required: z.boolean().default(false),
	filterable: z.boolean().default(false),
	sortable: z.boolean().default(false),
});

// Refine function
function attributeRefine(attr: any, ctx: any) {
	if (attr.type === 'enum' && (!attr.enumValues || attr.enumValues.length === 0)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['enumValues'],
			message: 'enumValues is required when type is enum',
		});
	}
	if (attr.unit && attr.type !== 'number') {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['unit'],
			message: 'unit is allowed only for type number',
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
	name: z.string().min(1),
	groups: z.array(groupBaseObject).min(1),
});

export const attributeTemplateCreateSchema = z.object({
	body: z.object({
		template: templateBaseObject,
	}),
});
export const attributeTemplateUpdateSchema = templateBaseObject.partial({});
