module.exports = class UserDto  {
  email;
  id;
  isActivated;
  role;
  phone;
  name;
  surname;
  driversLicense;
  wallet;

  
  constructor(model) {
  this.email = model.email;
  this.id = model._id;
  this.isActivated = model.isActivated;
  this.role = model.role;
  this.phone =model.phone;
  this.name = model.name;
  this.surname = model.surname;
  this.driversLicense = model.driversLicense;
  this.wallet = model.wallet;
}
}

