// Common validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Min 6 chars
  return password && password.length >= 6;
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const validateApplicationDeadline = (deadline) => {
  return new Date() <= new Date(deadline);
};

export const validateFileSize = (fileSizeInBytes, maxSizeInMB = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return fileSizeInBytes <= maxSizeInBytes;
};

export const validateProfileCompletion = (profile) => {
  return (
    profile.phone &&
    profile.course &&
    profile.college &&
    profile.year &&
    profile.resume?.url
  );
};

export const validateCompanyDetails = (company) => {
  return company.name && company.createdBy;
};

export const validateDriveDetails = (drive) => {
  return (
    drive.company &&
    drive.jobRole &&
    drive.description &&
    drive.vacancies &&
    drive.location &&
    drive.deadline
  );
};

export const validateAuthHeaders = (req) => {
  if (!req.headers.authorization) {
    return { valid: false, message: "Authorization header missing" };
  }

  if (!req.headers.authorization.startsWith("Bearer")) {
    return { valid: false, message: "Invalid authorization format" };
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return { valid: false, message: "Token missing" };
  }

  return { valid: true, token };
};

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
