export function handleSaveError(error, data, next) {
  error.status = 400;
  next();
}

export function setUpdateSettings(next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
}
