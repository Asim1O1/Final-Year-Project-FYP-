import Joi from "joi";
export const validateRegisterInput = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
    userName: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    address: Joi.string().required(),
    role: Joi.string()
      .valid("system_admin", "hospital_admin", "doctor", "general_user")
      .required(),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .required(),
    gender: Joi.string().valid("male", "female").required(),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateLoginInput = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
});
