"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deleteForbiddenDirChars(s) {
    var forbiddenChars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
    for (var _i = 0, forbiddenChars_1 = forbiddenChars; _i < forbiddenChars_1.length; _i++) {
        var char_ = forbiddenChars_1[_i];
        s = s.replace(new RegExp("\\" + char_, 'gi'), '');
    }
    return s;
}
exports.default = deleteForbiddenDirChars;
