import { TCategory } from './category.interface';
import { Category } from './category.model';

export const updateCategoryAttributeTemplate = async (
	categoryId: string,
	templateId: string,
): Promise<TCategory | null> => {
	return await Category.findByIdAndUpdate(categoryId, { attributeTemplateId: templateId }, { new: true });
};
