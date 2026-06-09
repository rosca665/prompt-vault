export interface Category {
  id: string;
  name: string;
  description: string;
  color: string; // Hex or CSS color name
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
}
