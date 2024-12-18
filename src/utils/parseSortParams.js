const sortOrderList = ['asc', 'desc'];

export function parseSortParams({ sortBy, sortOrder }, sortByList) {
  const parsedSortOrder = sortOrderList.includes(sortOrder) ? sortOrder : 'asc';
  const parsedSortBy = sortByList.includes(sortBy) ? sortBy : '_id';
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
