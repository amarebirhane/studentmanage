"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return apiResponse_1.ApiResponse.error(res, 'Validation failed', 400, error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                })));
            }
            return apiResponse_1.ApiResponse.error(res, 'Internal server error during validation', 500);
        }
    };
};
exports.validate = validate;
