import { model, Schema } from 'mongoose';
import { AttributeType, TAttribute, TAttributeGroup, TAttributeTemplate } from './attribute.template.interface';

const attributeSchema = new Schema<TAttribute>(
	{
		name: { type: String, required: true },
		key: { type: String, required: true },
		type: {
			type: String,
			enum: Object.values(AttributeType),
			required: true,
		},
		unit: { type: String },
		options: { type: [String] },
		validations: {
			min: Number,
			max: Number,
			pattern: String,
			minLength: Number,
			maxLength: Number,
		},
		required: { type: Boolean, default: false },
		filterable: { type: Boolean, default: false },
		sortable: { type: Boolean, default: false },
	},
	{ _id: true },
);

const attributeGroupSchema = new Schema<TAttributeGroup>(
	{
		groupName: { type: String, required: true },
		order: { type: Number, required: true },
		attributes: { type: [attributeSchema], required: true },
	},
	{ _id: true },
);

const attributeTemplateSchema = new Schema<TAttributeTemplate>(
	{
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
			index: true,
		},
		name: { type: String, required: true },
		groups: { type: [attributeGroupSchema], required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export const AttributeTemplate = model<TAttributeTemplate>('AttributeTemplate', attributeTemplateSchema);
