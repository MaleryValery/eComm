import { Category } from '@commercetools/platform-sdk';

interface CategoryTree {
  parent: Category;
  children: Category[] | unknown[];
}

export default function createCategoryTree(items: Category[]) {
  const result: CategoryTree[] = [];
  items.forEach((parentItem) => {
    if (parentItem.ancestors.length === 0) {
      result.push({ parent: parentItem, children: [] });
    }
  });
  items.forEach((childItem) => {
    if (childItem.ancestors[0]) {
      result.forEach((one, index) => {
        if (one.parent.id === childItem.ancestors[0].id) {
          result[index].children?.push(childItem);
        }
      });
    }
  });

  return result;
}
