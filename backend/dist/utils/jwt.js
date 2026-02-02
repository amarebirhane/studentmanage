"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.signRefreshToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.expire,
    });
};
exports.signToken = signToken;
const signRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.config.jwt.refreshSecret, {
        expiresIn: config_1.config.jwt.refreshExpire,
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.config.jwt.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
