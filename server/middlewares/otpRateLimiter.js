import rateLimit from "express-rate-limit";

const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body.email || req.ip,
  message: {
    isSuccess: false,
    statusCode: 429,
    message: "Too many OTP attempts. Please try again later.",
  },
  headers: true,
});

export default otpRateLimiter;
