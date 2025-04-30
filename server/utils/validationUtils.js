import Joi from "joi";

export const validateRegisterInput = Joi.object({
  fullName: Joi.string().min(3).required(),
  userName: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  address: Joi.string().required(),
  role: Joi.string().valid("system_admin", "hospital_admin", "doctor", "user"),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .required(),
  gender: Joi.string().valid("male", "female", "other").required(),
});

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

export const validateHospitalInput = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Hospital name is required.",
    "string.min": "Hospital name must be at least 3 characters long.",
  }),
  location: Joi.string().min(5).required().messages({
    "string.empty": "Location is required.",
    "string.min": "Location must be at least 5 characters long.",
  }),
  contactNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.empty": "Contact number is required.",
      "string.pattern.base": "Contact number must contain only digits.",
      "string.min": "Contact number must be at least 10 digits.",
      "string.max": "Contact number must not exceed 15 digits.",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
  }),
  hospitalImage: Joi.string().uri().optional(),
  specialties: Joi.array()
    .items(Joi.string().min(3).required())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one specialty is required.",
      "string.empty": "Specialty cannot be empty.",
      "string.min": "Specialty must be at least 3 characters long.",
    }),
  medicalTests: Joi.array().items(
    Joi.object({
      name: Joi.string().min(3).required().messages({
        "string.empty": "Test name is required.",
        "string.min": "Test name must be at least 3 characters long.",
      }),
      price: Joi.string().min(1).required().messages({
        "string.empty": "Price is required.",
        "string.min": "Price must be at least 1 character long.",
      }),
    })
  ),
  notifications: Joi.array().items(
    Joi.object({
      message: Joi.string().min(5).required().messages({
        "string.empty": "Notification message is required.",
        "string.min":
          "Notification message must be at least 5 characters long.",
      }),
      date: Joi.date().optional(),
    })
  ),
});

export const validateDoctorInput = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  role: Joi.string().valid("doctor").default("doctor"),
  gender: Joi.string().valid("male", "female", "other").required(),
  specialization: Joi.string().trim().min(3).max(100).required(),
  address: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .required(),
  qualifications: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required(),
        university: Joi.string().required(),
        graduationYear: Joi.number().required(),
      })
    )
    .required(),

  consultationFee: Joi.string().min(0).required(),
  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
          .required(),
        startTime: Joi.string()
          .pattern(/^([0-9]{2}):([0-9]{2})$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([0-9]{2}):([0-9]{2})$/)
          .required(),
      })
    )
    .default([]),
  hospital: Joi.string().length(24).required(),
  yearsOfExperience: Joi.number().integer().min(0).max(100).required(),
  isVerified: Joi.boolean().default(false),
});
