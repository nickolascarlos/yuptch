"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var woocommerce_rest_api_1 = __importDefault(require("@woocommerce/woocommerce-rest-api"));
exports.default = new woocommerce_rest_api_1.default({
    url: "https://www.gransports.com.br",
    consumerKey: "ck_5efdbbd0da44c57342fa808afdbd13b38a06b535",
    consumerSecret: "cs_d608077177f82629790b082e60cf7167ae98ce58",
    version: "wc/v3"
});
