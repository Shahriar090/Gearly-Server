// export type TAttributeType = 'string' | 'number' | 'boolean' | 'enum';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

export enum AttributeType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	ARRAY = 'array',
	SELECT = 'select',
	MULTI_SELECT = 'multiSelect',
}

export type AttributeValidation = {
	min?: number;
	max?: number;
	pattern?: string;
	minLength?: number;
	maxLength?: number;
};

export interface TAttribute {
	_id?: Types.ObjectId;
	name: string;
	key: string;
	type: AttributeType;
	unit?: string;
	options?: string[];
	validations?: AttributeValidation;
	required: boolean;
	filterable: boolean;
	sortable?: boolean;
}

export interface TAttributeGroup {
	_id?: Types.ObjectId;
	groupName: string;
	order: number;
	attributes: TAttribute[];
}

export interface TAttributeTemplate {
	categoryId: ObjectId;
	name: string;
	groups: TAttributeGroup[];
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	sanitizedAttributes?: Record<string, any>;
}

export interface ValidationError {
	field: string;
	message: string;
}
