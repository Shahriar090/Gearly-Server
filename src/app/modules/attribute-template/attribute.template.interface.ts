export type TAttributeType = 'string' | 'number' | 'boolean' | 'enum';
import { ObjectId } from 'mongodb';

export interface TAttribute {
	name: string;
	key: string;
	type: TAttributeType;
	unit?: string;
	enumValues?: string[];
	required: boolean;
	filterable: boolean;
	sortable?: boolean;
}

export interface TAttributeGroup {
	groupName: string;
	order: number;
	attributes: TAttribute[];
}

export interface TAttributeTemplate {
	categoryId: ObjectId;
	name: string;
	groups: TAttributeGroup[];
}
