// src/validation/validators.js
import Joi from "joi";

// role can be: user, seller or admin
export const registerSchema = Joi.object({
  role: Joi.string().valid("user", "seller", "admin").required(),

  // common for all
  firstName: Joi.string().trim().min(2).when("role", {
    is: "user",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  lastName: Joi.string().trim().min(2).when("role", {
    is: "user",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  businessName: Joi.string().trim().min(3).when("role", {
    is: "seller",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  address: Joi.string().min(3).when("role", {
    is: "seller",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ==================== PRODUCT ====================
export const productCreateSchema = Joi.object({
  sellerId: Joi.string().required(), // string of user with role = seller
  title: Joi.string().trim().required(),
  category: Joi.string().trim().optional(),
  price: Joi.number().required(),
  discountPrice: Joi.number().optional(),
  description: Joi.string().trim().required(),
  images: Joi.array().items(
  Joi.string().pattern(/^(https?:\/\/|\/)/, "url or path")
).min(1).required(),
});


export const productUpdateSchema = Joi.object({
  title: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  price: Joi.number().optional(),
  discountPrice: Joi.number().optional(),
  description: Joi.string().trim().optional(),
  images: Joi.array().items(
  Joi.string().pattern(/^(https?:\/\/|\/)/, "url or path")
).min(1).required(),

});

// ==================== CART ====================
export const addToCartSchema = Joi.object({
  product: Joi.object({
    sellerId: Joi.string().required(),
    title: Joi.string().required(),
    category: Joi.string().optional(),
    price: Joi.number().required(),
    discountPrice: Joi.number().optional(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
  }).required(),
  quantity: Joi.number().min(1).required(),
});

// ==================== ORDER ====================
export const orderSchema = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.object({
          sellerId: Joi.string().required(),
          title: Joi.string().required(),
          category: Joi.string().optional(),
          price: Joi.number().required(),
          discountPrice: Joi.number().optional(),
          description: Joi.string().required(),
          images: Joi.array().items(Joi.string().uri()).min(1).required(),
        }).required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().required(),
});

// ==================== REVIEW ====================
export const reviewSchema = Joi.object({
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(1).required(),
});

// ==================== CONTACT ====================
export const contactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  subject: Joi.string(),
  message: Joi.string().min(5).required(),
});
