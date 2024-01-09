export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type CreateInputUserModelType = {
  login: string;
  password: string;
  email: string;
};
export type CreatedUserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type UserWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModel[];
};
