import { z } from 'zod';

// Base attribute schema (all required for creation)
export const baseAttributeSchemaSmartphones = z
	.object({
		name: z.string().min(1, 'Attribute name is required'),
		key: z.string().regex(/^[a-z_]+$/, 'Key must be lowercase letters/underscores only'),
		type: z.enum(['string', 'number', 'boolean', 'enum']),
		unit: z.string().optional(),
		enumValues: z.array(z.string()).optional(),
		required: z.boolean().default(false),
		filterable: z.boolean().default(false),
		sortable: z.boolean().default(false),
	})
	.superRefine((attr, ctx) => {
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
	});

// -----------------------------

export const baseAttributeGroupSchemaSmartphones = z.object({
	groupName: z.string().min(1, 'Group name is required'),
	order: z.number().int().nonnegative('Order must be >= 0'),
	attributes: z.array(baseAttributeSchemaSmartphones).min(1, 'At least one attribute required'),
});

// ---------------------------------

export const baseAttributeTemplateSchemaSmartphones = z.object({
	name: z.string().min(1, 'Template name is required'),
	groups: z.array(baseAttributeGroupSchemaSmartphones).min(1, 'At least one group is required'),
});

// export all necessary things

// create
export const attributeCreateSchemaSmartphones = baseAttributeGroupSchemaSmartphones;

export const attributeGroupCreateSchemaSmartphones = baseAttributeGroupSchemaSmartphones;

export const attributeTemplateCreateSmartphones = baseAttributeTemplateSchemaSmartphones;

// update
export const attributeUpdateSchemaSmartphones = baseAttributeGroupSchemaSmartphones.partial();

export const attributeGroupUpdateSchemaSmartphones = baseAttributeGroupSchemaSmartphones.partial();

export const attributeTemplateUpdateSchemaSmartphones = baseAttributeTemplateSchemaSmartphones.partial();
