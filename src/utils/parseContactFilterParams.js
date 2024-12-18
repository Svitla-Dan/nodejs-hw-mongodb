const typeList = ['work', 'home', 'personal'];

function parseType(contactType) {
  if (typeof contactType !== 'string') return;
  if (typeList.includes(contactType)) return contactType;
}

function parseBoolean(value) {
  if (typeof value !== 'string') return;
  if (value === '1' || value.toLowerCase() === 'true') return true;
  if (value === '0' || value.toLowerCase() === 'false') return false;
}

export function parseContactFilterParams(queryParams) {
  const { contactType, isFavourite } = queryParams;
  return {
    contactType: parseType(contactType),
    isFavourite: parseBoolean(isFavourite),
  };
}
