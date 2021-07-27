"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = __importDefault(require("console"));
var Collection_1 = __importDefault(require("../classes/Collection"));
var wooApi_1 = __importDefault(require("./wooApi"));
function checkCollectionNovelties(collectionUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var novelties, collectionInfo, existentProductsQuantityInARow, _i, _a, _b, title, hash, relativeUrl, productInfo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    novelties = [];
                    return [4 /*yield*/, Collection_1.default.get(collectionUrl, true)];
                case 1:
                    collectionInfo = _c.sent();
                    console_1.default.log("Checando " + collectionInfo.title + " - " + collectionInfo.pagesNumber + " p\u00E1ginas");
                    existentProductsQuantityInARow = 0 // Used to predict 'end' of should-run
                    ;
                    _i = 0, _a = collectionInfo.albums;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    _b = _a[_i], title = _b.title, hash = _b.hash, relativeUrl = _b.relativeUrl;
                    return [4 /*yield*/, wooApi_1.default.get('products', { sku: hash })];
                case 3:
                    productInfo = (_c.sent()).data;
                    if (productInfo.length === 0) {
                        // O produto não existe
                        novelties.push({
                            title: title,
                            hash: hash,
                            relativeUrl: relativeUrl
                        });
                        console_1.default.log("[!] NOVIDADE: " + title + " - " + hash);
                        existentProductsQuantityInARow = 0;
                    }
                    else
                        existentProductsQuantityInARow += 1;
                    if (existentProductsQuantityInARow >= 10) {
                        console_1.default.log('10 existent products in a row - Quitting...');
                        return [3 /*break*/, 5];
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, novelties];
            }
        });
    });
}
exports.default = checkCollectionNovelties;
