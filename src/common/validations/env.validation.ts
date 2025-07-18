import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number()
    .integer()
    .min(1024)
    .max(65535)
    .required()
    .label('PORT')
    .messages({
      'number.base': `"PORT" must be a number.`,
      'number.min': `"PORT" must be at least 1024 (reserved ports are not allowed).`,
      'number.max': `"PORT" must be less than or equal to 65535.`,
    }),
  MONGODB_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\/.+$/)
    .required()
    .label('MONGO_URI')
    .messages({
      'string.pattern.base': `"MONGO_URI" must be a valid MongoDB connection string starting with "mongodb://" or "mongodb+srv://".`,
    }),
});
