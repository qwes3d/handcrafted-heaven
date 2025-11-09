// backend/middleware/validate.js
//import { registerSchema, loginSchema, productCreateSchema, productUpdateSchema } from "../validation/validators.js";

/**
 * Middleware to validate request body using a Joi schema
 * @param {Object} schema - Joi schema to validate against
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((d) => d.message) });
    }
    next();
  };
};

// Example usage:
// validateBody(registerSchema)
// validateBody(loginSchema)
// validateBody(productCreateSchema)
// validateBody(productUpdateSchema)
