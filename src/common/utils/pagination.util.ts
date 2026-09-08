import { SelectQueryBuilder } from 'typeorm';
import type { ObjectLiteral } from 'typeorm';
import type { PaginatedResult, PaginationMeta } from '../type/pagination.types.js';

export interface PaginateOptions { page?: number; limit?: number; }

export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(options.page ?? 1, 1);
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  const [items, totalItems] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  const meta: PaginationMeta = { page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
  return { items, meta };
}