import { ObjectId } from 'mongodb';

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};

export type CreateInputBlogModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputDtoType = {
  blogId: ObjectId;
  blogName: string;
};

export type UpdateInputBlogModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type CreatedBlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
