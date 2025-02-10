import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  // mongoose query object (Product, User, etc.). it can return an array of object or a single object.
  public modelQuery: Query<T[], T>;
  //   query parameters that comes from the client.(req.query)
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //   methods

  //   search logic
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  //   filter logic
  filter() {
    const queryObject = { ...this.query }; //copy of original query object

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((elem) => delete queryObject[elem]);

    this.modelQuery = this.modelQuery.find(queryObject);

    return this;
  }

  //   sort logic
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',').join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  //   pagination logic
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //   fields limit logic
  fields() {
    const fields = this?.query?.fields
      ? (this.query.fields as string).split(',').join(' ')
      : '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 1;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
