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
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var md5 = require('md5');
var Album = /** @class */ (function () {
    function Album(title, baseUrl, relativeUrl, mainImageId, imagesUrls, isLink, href) {
        this.title = title;
        this.hash = md5(title);
        this.url = {
            absolute: baseUrl + relativeUrl,
            relative: relativeUrl
        };
        this.mainImageId = mainImageId;
        this.images = imagesUrls;
        this.isLink = isLink;
        this.href = href;
    }
    Album.get = function (albumUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var albumHTMLContent, $, baseUrl, albumTitle, mainImageId, imagesUrls, _b, albumIsALink, albumHref;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(albumUrl)];
                    case 1:
                        albumHTMLContent = (_c.sent()).data;
                        $ = cheerio_1.default.load(albumHTMLContent);
                        baseUrl = '//' + albumUrl.split('?')[0].split('/')[2] + '/';
                        albumTitle = $('div.showalbumheader__gallerydec h2 span.showalbumheader__gallerytitle').text();
                        mainImageId = (_a = $('div.showalbumheader__gallerycover img').attr('src')) === null || _a === void 0 ? void 0 : _a.split('/')[4];
                        imagesUrls = $("div.showalbum__parent.showalbum__nor.nor\n\t\t\t\t\t\t\t\t\t\t\tdiv.showalbum__children.image__main\n\t\t\t\t\t\t\t\t\t\t\tdiv.image__imagewrap\n\t\t\t\t\t\t\t\t\t\t\timg")
                            .map(function (_, img) { return $(img).attr('data-origin-src'); })
                            .toArray() // É estranho, mas é assim mesmo, com esse .get() no final :/
                        ;
                        return [4 /*yield*/, isAlbumALink($)];
                    case 2:
                        _b = _c.sent(), albumIsALink = _b[0], albumHref = _b[1];
                        return [2 /*return*/, new Album(albumTitle, baseUrl, albumUrl.split('?')[0].split('/').slice(3).join('/') + '/', mainImageId, imagesUrls, albumIsALink, albumHref)];
                }
            });
        });
    };
    return Album;
}());
function isAlbumALink($) {
    return __awaiter(this, void 0, void 0, function () {
        var href, isCollection;
        return __generator(this, function (_a) {
            href = $('div.showalbumheader__gallerysubtitle.htmlwrap__main a').attr('href');
            isCollection = (href === null || href === void 0 ? void 0 : href.includes('/collections/')) ? true : false;
            return [2 /*return*/, [
                    isCollection,
                    isCollection ? href : ''
                ]];
        });
    });
}
exports.default = Album;
