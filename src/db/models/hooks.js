export function handleSaveError(error, data, next) {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
}

export function setUpdateSettings(next) {
  this.options = {
    ...this.options,
    runValidators: true,
    new: true,
  };
  next();
}
