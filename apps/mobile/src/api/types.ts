export interface CategoryResponse {
  id: number;
  name: string;
  color: string;
}

export interface PersonResponse {
  id: number;
  fullName: string;
  birthDate: string;
  birthYearKnown: boolean;
  note: string | null;
  photoUrl: string | null;
  category: CategoryResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PersonRequest {
  fullName: string;
  birthDate: string;
  birthYearKnown: boolean;
  categoryId: number | null;
  note: string | null;
}
