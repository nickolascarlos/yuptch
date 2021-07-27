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
var cheerio_1 = __importDefault(require("cheerio"));
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var Collection_1 = __importDefault(require("./classes/Collection"));
var checkCollectionNovelties_1 = __importDefault(require("./utilities/checkCollectionNovelties"));
var albumImagesDownload_1 = __importDefault(require("./utilities/albumImagesDownload"));
var posix_1 = __importDefault(require("path/posix"));
var getProductYearByTitle_1 = __importDefault(require("./utilities/getProductYearByTitle"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var collectionsToAnalyze, novelties, _i, collectionsToAnalyze_1, collection_1, _a, _b, _c, e_1, file, _d, novelties_1, novelty, n, novelty, productYear, e_2, toCheckCollections, _e, toCheckCollections_1, collection_2, urlContent, $, collection;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                collectionsToAnalyze = [
                    {
                        title: 'Brasileirão',
                        url: 'https://minkang.x.yupoo.com/collections/680738'
                    },
                    {
                        title: 'Bundesliga',
                        url: 'https://minkang.x.yupoo.com/collections/680725'
                    },
                    {
                        title: 'Itália Série A',
                        url: 'https://minkang.x.yupoo.com/collections/708736'
                    },
                    {
                        title: 'Premiere League',
                        url: 'https://minkang.x.yupoo.com/collections/680719'
                    },
                    {
                        title: 'França League 1',
                        url: 'https://minkang.x.yupoo.com/collections/2897018'
                    },
                    {
                        title: 'La Liga',
                        url: 'https://minkang.x.yupoo.com/collections/680717'
                    },
                    {
                        title: 'Japan League',
                        url: 'https://minkang.x.yupoo.com/collections/2827820'
                    },
                    {
                        title: 'Seleções',
                        url: 'https://minkang.x.yupoo.com/collections/3118456'
                    },
                    {
                        title: 'MLS',
                        url: 'https://minkang.x.yupoo.com/collections/3247384'
                    },
                    {
                        title: 'Eredivisie',
                        url: 'https://minkang.x.yupoo.com/collections/3302916'
                    },
                    {
                        title: 'Liga MX',
                        url: 'https://minkang.x.yupoo.com/collections/3302917'
                    },
                    {
                        title: 'SAF',
                        url: 'https://minkang.x.yupoo.com/collections/3302915'
                    },
                    {
                        title: 'Primeira Liga',
                        url: 'https://minkang.x.yupoo.com/collections/3302977'
                    }
                ];
                novelties = [];
                _i = 0, collectionsToAnalyze_1 = collectionsToAnalyze;
                _f.label = 1;
            case 1:
                if (!(_i < collectionsToAnalyze_1.length)) return [3 /*break*/, 6];
                collection_1 = collectionsToAnalyze_1[_i];
                console.log("Collection: " + collection_1.title + " | " + collection_1.url);
                _f.label = 2;
            case 2:
                _f.trys.push([2, 4, , 5]);
                _b = (_a = novelties.push).apply;
                _c = [novelties];
                return [4 /*yield*/, checkCollectionNovelties_1.default(collection_1.url)];
            case 3:
                _b.apply(_a, _c.concat([_f.sent()]));
                return [3 /*break*/, 5];
            case 4:
                e_1 = _f.sent();
                console.log('ERRO! ::: ' + e_1.message);
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                file = fs_1.default.openSync(posix_1.default.resolve('./noveltiesList.txt'), 'w+');
                for (_d = 0, novelties_1 = novelties; _d < novelties_1.length; _d++) {
                    novelty = novelties_1[_d];
                    fs_1.default.writeSync(file, 'https://minkang.x.yupoo.com' + novelty.relativeUrl + '\n');
                }
                fs_1.default.closeSync(file);
                n = 0;
                _f.label = 7;
            case 7:
                if (!(n < novelties.length)) return [3 /*break*/, 12];
                novelty = novelties[n];
                console.log(n + 1 + " de " + novelties.length);
                productYear = getProductYearByTitle_1.default(novelty.title);
                _f.label = 8;
            case 8:
                _f.trys.push([8, 10, , 11]);
                return [4 /*yield*/, albumImagesDownload_1.default('https://minkang.x.yupoo.com' + novelty.relativeUrl, "./downloads/novelties/" + (productYear[productYear.length - 1] === '2022' ? 'actual' : 'maybe'))];
            case 9:
                _f.sent();
                return [3 /*break*/, 11];
            case 10:
                e_2 = _f.sent();
                console.log("N\u00C3O FOI POSS\u00CDVEL BAIXAR O \u00C1LBUM " + (n + 1) + " ::: " + e_2.message);
                return [3 /*break*/, 11];
            case 11:
                n++;
                return [3 /*break*/, 7];
            case 12:
                console.log(novelties);
                // try {
                // await albumImagesDownload('https://minkang.x.yupoo.com/albums/96145133?uid=1&isSubCate=false&referrercate=680717', './downloads/')
                // 	console.log('Yay!')
                // } catch(e) {
                // 	console.log('Duh :/ ::: ' + e.message)
                // }
                return [2 /*return*/]; //
            case 13:
                if (!(_e < toCheckCollections_1.length)) return [3 /*break*/, 16];
                collection_2 = toCheckCollections_1[_e];
                return [4 /*yield*/, checkCollectionNovelties_1.default(collection_2)];
            case 14:
                _f.sent();
                _f.label = 15;
            case 15:
                _e++;
                return [3 /*break*/, 13];
            case 16: return [2 /*return*/];
            case 17:
                urlContent = (_f.sent()).data;
                $ = cheerio_1.default.load(urlContent);
                return [4 /*yield*/, Collection_1.default.get('https://minkang.x.yupoo.com/collections/680738')];
            case 18:
                collection = _f.sent();
                console.log(collection);
                console.log('====================');
                return [4 /*yield*/, collection.loadPages(true)];
            case 19:
                _f.sent();
                console.log(collection);
                return [2 /*return*/];
        }
    });
}); })();
