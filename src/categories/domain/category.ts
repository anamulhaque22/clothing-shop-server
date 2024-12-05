class ParentCategory {
  id: number;
  name?: string;
}
export class Category {
  id: number;
  name?: string;
  parentCategory?: ParentCategory;
  isVisibleInMenu?: boolean;
}
