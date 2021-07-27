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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var md5 = require('md5');
var Collection = /** @class */ (function () {
    function Collection(title, url, pagesNumber, albums, loadedAlbumsNumber, pagesLoaded, allPagesLoaded) {
        if (albums === void 0) { albums = []; }
        if (pagesLoaded === void 0) { pagesLoaded = []; }
        if (allPagesLoaded === void 0) { allPagesLoaded = false; }
        this.albums = [];
        this.pagesLoaded = [];
        this.allPagesLoaded = false;
        this.title = title;
        this.url = url;
        this.pagesNumber = pagesNumber;
        this.albums = albums;
        this.loadedAlbumsNumber = loadedAlbumsNumber;
        this.pagesLoaded = pagesLoaded;
        this.allPagesLoaded = allPagesLoaded;
    }
    Collection.get = function (collectionUrl, pagesToLoad) {
        var _a;
        if (pagesToLoad === void 0) { pagesToLoad = []; }
        return __awaiter(this, void 0, void 0, function () {
            var collectionHTMLContent, $, collectionTitle, collectionPagesNumber, _b, content, pagesLoaded;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(collectionUrl, { timeout: 45000 })];
                    case 1:
                        collectionHTMLContent = (_c.sent()).data;
                        $ = cheerio_1.default.load(collectionHTMLContent);
                        collectionTitle = $('div.text_overflow.showheader__menuslink.showheader__currentcate a').eq(0).text();
                        collectionPagesNumber = parseInt(((_a = $('form.pagination__jumpwrap span').eq(0).text().match(/([0-9])+/i)) === null || _a === void 0 ? void 0 : _a[0]) || '1');
                        return [4 /*yield*/, this.loadCollectionPages(collectionUrl, pagesToLoad, collectionPagesNumber, collectionHTMLContent)];
                    case 2:
                        _b = _c.sent(), content = _b.content, pagesLoaded = _b.pagesLoaded;
                        return [2 /*return*/, new Collection(collectionTitle, collectionUrl, collectionPagesNumber, content, content.length, pagesLoaded, Array.from(Array(collectionPagesNumber).keys()).every(function (page) { return pagesLoaded.includes(page + 1); }))];
                }
            });
        });
    };
    Collection.prototype.loadPages = function (pagesToLoad) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionPagesContent, pagesLoaded, pagesInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collectionPagesContent = [];
                        pagesLoaded = [];
                        return [4 /*yield*/, Collection.loadCollectionPages(this.url, pagesToLoad, this.pagesNumber)];
                    case 1:
                        pagesInfo = _a.sent();
                        collectionPagesContent = pagesInfo.content;
                        pagesLoaded = pagesInfo.pagesLoaded;
                        this.albums = __spreadArray(__spreadArray([], this.albums), collectionPagesContent);
                        this.pagesLoaded = Array.from(new Set(__spreadArray(__spreadArray([], this.pagesLoaded), pagesLoaded))); // Just to avoid the duplicates
                        this.allPagesLoaded = Array.from(Array(this.pagesNumber).keys()).every(function (page) { return pagesLoaded.includes(page + 1); });
                        this.loadedAlbumsNumber = this.albums.length;
                        return [2 /*return*/];
                }
            });
        });
    };
    Collection.loadCollectionPages = function (baseUrl, pagesToLoad, collectionPagesNumber, firstCollectionPageContent) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionPagesContent, pagesLoaded, _i, pagesToLoad_1, page, collectionPageHTMLContent, _a, collectionPageContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        collectionPagesContent = [];
                        pagesLoaded = [];
                        if (pagesToLoad === true)
                            pagesToLoad = Array.from(Array(collectionPagesNumber + 1).keys()).slice(1);
                        _i = 0, pagesToLoad_1 = pagesToLoad;
                        _b.label = 1;
                    case 1:
                        if (!(_i < pagesToLoad_1.length)) return [3 /*break*/, 7];
                        page = pagesToLoad_1[_i];
                        if (!(page === 1 && firstCollectionPageContent)) return [3 /*break*/, 2];
                        _a = firstCollectionPageContent;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, axios_1.default.get(baseUrl + '?page=' + (page).toString())];
                    case 3:
                        _a = (_b.sent()).data;
                        _b.label = 4;
                    case 4:
                        collectionPageHTMLContent = _a;
                        return [4 /*yield*/, this.getCollectionPageContent(collectionPageHTMLContent)];
                    case 5:
                        collectionPageContent = _b.sent();
                        if (collectionPageContent) {
                            collectionPagesContent.push.apply(collectionPagesContent, collectionPageContent);
                            pagesLoaded.push(page);
                        }
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, ({
                            content: collectionPagesContent,
                            pagesLoaded: pagesLoaded
                        })];
                }
            });
        });
    };
    Collection.getCollectionPageContent = function (collectionPageHTMLContent) {
        return __awaiter(this, void 0, void 0, function () {
            var $, pageContent;
            return __generator(this, function (_a) {
                $ = cheerio_1.default.load(collectionPageHTMLContent);
                pageContent = $('div.showindex__parent div.showindex__children')
                    .map(function (i, item) { return ({
                    title: $(item).find('a.album__main').attr('title'),
                    hash: md5($(item).find('a.album__main').attr('title')),
                    relativeUrl: $(item).find('a.album__main').attr('href')
                }); })
                    .toArray();
                return [2 /*return*/, pageContent.length > 0 ? pageContent : []];
            });
        });
    };
    return Collection;
}());
exports.default = Collection;
