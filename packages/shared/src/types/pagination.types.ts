import { z } from 'zod';
import { PaginationSchema, PaginatedResponseSchema } from '../schemas/pagination.schema';

export type Pagination = z.infer<typeof PaginationSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
