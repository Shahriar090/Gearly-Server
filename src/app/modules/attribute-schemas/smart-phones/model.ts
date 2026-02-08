import { model, Schema } from 'mongoose';
import { TAttribute, TAttributeGroup, TAttributeTemplate } from './interface';

const attributeSchema = new Schema<TAttribute>(
	{
		name: { type: String, required: true },
		key: { type: String, required: true },
		type: {
			type: String,
			enum: ['string', 'number', 'boolean', 'enum'],
			required: true,
		},
		unit: { type: String },
		enumValues: { type: [String] },
		required: { type: Boolean, default: false },
		filterable: { type: Boolean, default: false },
		sortable: { type: Boolean, default: false },
	},
	{ _id: false },
);

const attributeGroupSchema = new Schema<TAttributeGroup>(
	{
		groupName: { type: String, required: true },
		order: { type: Number, required: true },
		attributes: { type: [attributeSchema], required: true },
	},
	{ _id: false },
);

const attributeTemplateSchema = new Schema<TAttributeTemplate>(
	{
		name: { type: String, required: true, unique: true },
		groups: { type: [attributeGroupSchema], required: true },
	},
	{ timestamps: true },
);

export const AttributeTemplate = model<TAttributeTemplate>('SmartPhonesAttributeTemplate', attributeTemplateSchema);
