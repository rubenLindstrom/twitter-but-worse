const isEmpty = str => str.trim().length === 0;
const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx) ? true : false;
};

exports.isEmpty = isEmpty;
exports.isEmail = isEmail;

exports.validateSignUpData = (email, password, confirmPassword, handle) => {
  const errors = {};
  if (isEmpty(email)) errors.email = "Must not be empty";
  else if (!isEmail(email)) errors.email = "Must be a valid email";
  // -Password
  if (isEmpty(password)) errors.password = "Must not be empty";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords must match";
  // -Handle
  if (isEmpty(handle)) errors.handle = "Must not be empty";
  return { errors, isValid: Object.keys(errors).length === 0 };
};

exports.validateLogInData = (email, password) => {
  let errors = {};
  if (isEmpty(email)) errors.email = "Must not be empty";
  if (isEmpty(password)) errors.password = "Must not be empty";

  return { errors, isValid: Object.keys(errors).length === 0 };
};

exports.reduceUserDetails = (bio, website, location) => {
  let userDetails = {};

  if (!isEmpty(bio)) userDetails.bio = bio;
  if (!isEmpty(website)) {
    userDetails.website =
      (website.trim().substring(0, 4) !== "http" ? "http://" : "") +
      website.trim();
  }
  if (!isEmpty(location)) userDetails.location = location;

  return userDetails;
};
