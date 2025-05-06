// upgraded query builder to handle query and aggregation

import { PipelineStage, Query } from 'mongoose';
import { Model } from 'mongoose';

class QueryBuilder<T> {
  private model: Model<T>;
  private modelQuery: Query<T[], T> | PipelineStage[];
  private query: Record<string, unknown>;
  private isAggregation: boolean;

  constructor(
    model: Model<T>,
    query: Record<string, unknown>,
    useAggregation: boolean = false,
  ) {
    this.model = model;
    this.query = query;
    this.isAggregation = useAggregation;
    this.modelQuery = useAggregation ? [] : this.model.find();
  }

  // search
  search(searchableFields: string[]) {
    if (this.query?.searchTerm) {
      const searchTerm = this.query.searchTerm as string;
      // $or for searching multiple fields, regex (regular expressions) for partial match and options 'i' for ensure case insensitive.
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          // field = name, email etc. within searchable fields array.
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      };

      if (this.isAggregation) {
        (this.modelQuery as PipelineStage[]).push({ $match: searchQuery });
      } else {
        this.modelQuery = (this.modelQuery as Query<T[], T>).find(searchQuery);
      }
    }
    return this;
  }

  // filter
  filter() {
    // creating a copy object of query object
    const queryObject = { ...this.query };
    //excluding fields which are not going to mongodb query for filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    // removing fields from queryObject which are not allowed to use in mongodb filtering
    excludeFields.forEach((field) => delete queryObject[field]);

    // converting operators (e.g., gte → $gte)
    const queryStr = JSON.stringify(queryObject);
    const formattedStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`,
    );
    const parseQuery = JSON.parse(formattedStr);

    if (this.isAggregation) {
      (this.modelQuery as PipelineStage[]).push({ $match: parseQuery });
    } else {
      this.modelQuery = (this.modelQuery as Query<T[], T>).find(parseQuery);
    }

    return this;
  }

  // sorting
  sort() {
    const sortBy =
      (this.query?.sort as string)?.split(',').join(' ') || '-createdAt';

    if (this.isAggregation) {
      (this.modelQuery as PipelineStage[]).push({ $sort: { createdAt: -1 } });
    } else {
      this.modelQuery = (this.modelQuery as Query<T[], T>).sort(sortBy);
    }
    return this;
  }

  // pagination
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    if (this.isAggregation) {
      (this.modelQuery as PipelineStage[]).push(
        { $skip: skip },
        { $limit: limit },
      );
    } else {
      this.modelQuery = (this.modelQuery as Query<T[], T>)
        .skip(skip)
        .limit(limit);
    }
    return this;
  }

  // fields selection

  fields() {
    const fields = this.query?.fields
      ? (this.query.fields as string).split(',').reduce(
          (acc, field) => {
            acc[field] = 1;
            return acc;
          },
          {} as Record<string, number>,
        )
      : null;

    if (fields) {
      if (this.isAggregation) {
        (this.modelQuery as PipelineStage[]).push({ $project: fields });
      } else {
        this.modelQuery = (this.modelQuery as Query<T[], T>).select(
          Object.keys(fields).join(' '),
        );
      }
    }

    return this;
  }

  // execute query
  async exec() {
    if (this.isAggregation) {
      return await this.model.aggregate(this.modelQuery as PipelineStage[]);
    }
    return await (this.modelQuery as Query<T[], T>).exec();
  }

  // get total count
  async countTotal() {
    if (this.isAggregation) {
      // for aggregation, use $count stage
      const countPipeline = [...(this.modelQuery as PipelineStage[])];
      countPipeline.push({ $count: 'total' }); // Add the $count stage

      // execute the aggregation to get the count
      const countResult = await this.model.aggregate(countPipeline);

      const total = countResult.length > 0 ? countResult[0].total : 0;
      const page = Number(this.query?.page) || 1;
      const limit = Number(this.query?.limit) || 10;
      const totalPage = Math.ceil(total / limit);

      return {
        page,
        limit,
        total,
        totalPage,
      };
    } else {
      // for regular queries, use countDocuments
      const totalQueries = (this.modelQuery as Query<T[], T>).getFilter();
      const total = await this.model.countDocuments(totalQueries);

      const page = Number(this.query?.page) || 1;
      const limit = Number(this.query?.limit) || 6;
      const totalPage = Math.ceil(total / limit);

      return {
        page,
        limit,
        total,
        totalPage,
      };
    }
  }
}

export default QueryBuilder;
