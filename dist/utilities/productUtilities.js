"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _TeamPredictor_instances, _TeamPredictor_saveDB;
var fs = require('fs');
var TeamPredictor = /** @class */ (function () {
    function TeamPredictor() {
        _TeamPredictor_instances.add(this);
        // Loads teams
        this.DB = fs.readFileSync('./teams.db', { encoding: 'utf-8', flag: 'r' })
            .split(';')
            .map(function (tupla) { return tupla.split(","); })
            .filter(function (teamTerms) {
            for (var i = 0; i < teamTerms.length; i++)
                if (teamTerms[i] === '')
                    return false;
            return true;
        });
        console.log(':)');
        this.verifyPossibleMismatches();
    }
    TeamPredictor.prototype.removeAccents = function (str) {
        // Pelo amor de DEUS, não fui eu que escrevi isso!!!
        // Só tô usando porque funciona e eu tô com preguiça
        var wAccent = "ÀÁÂÃÄÅÆÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæèéêëìíîïðñòóôõöøùúûüýþÿŕ";
        var woAccent = "AAAAAAAEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaeeeeiiiionoooooouuuuybyr";
        var newStr = "";
        for (var i = 0; i < str.length; i++) {
            var swap = false;
            for (var a = 0; a < wAccent.length; a++) {
                if (str.substr(i, 1) == wAccent.substr(a, 1)) {
                    newStr += woAccent.substr(a, 1);
                    swap = true;
                    break;
                }
            }
            if (swap == false) {
                newStr += str.substr(i, 1);
            }
        }
        return newStr;
    };
    TeamPredictor.prototype.predictByTitle = function (title) {
        for (var _i = 0, _a = this.DB; _i < _a.length; _i++) {
            var teamArray = _a[_i];
            if (includesAny(this.removeAccents(title.toLowerCase()), teamArray))
                return teamArray[0];
        }
        return '';
    }; // --[[ ~[ ^ ]~ ]]--
    TeamPredictor.prototype.addTeam = function (team) {
        var _this = this;
        if (!Array.isArray(team))
            throw 'TeamPredictor.addTeam(team): team must be an array, no matter what! Eg.: ["flamengo"]';
        var formattedTeam = team[0], alternatives = team.slice(1);
        alternatives = alternatives.map(function (str) { return _this.removeAccents(str).toLowerCase().trim(); });
        var processedTeamTerms = __spreadArray([
            formattedTeam
                .toLowerCase()
                .trim(),
            this.removeAccents(formattedTeam)
                .toLowerCase()
                .trim()
        ], alternatives);
        if (!includesAny(this.DB.flat(), processedTeamTerms)) {
            console.log("ADICIONANDO TIME...");
            this.DB.push(processedTeamTerms);
            // this.DB.push([team.toLowerCase(), this.removeAccents(team).toLowerCase()])
        }
        else {
            // Esse trecho serve para adicionar, se especificadas, novas alternativas ao nome do time,
            // já registrado (obviamente, já que estamos aqui) :)
            // Atenção! Leva-se em consideração apenas o primeiro termo especificado (bem formatado) para
            // encontrar a seguinte referência
            var specificTeamRef_1 = this.DB.find(function (teamTerms) { return teamTerms[0].toLowerCase() === team[0].toLowerCase(); });
            team.map(function (term) { return term.toLowerCase(); })
                .forEach(function (teamTerm) {
                if (!specificTeamRef_1.includes(teamTerm))
                    specificTeamRef_1.push(teamTerm);
            });
        }
        __classPrivateFieldGet(this, _TeamPredictor_instances, "m", _TeamPredictor_saveDB).call(this);
    };
    TeamPredictor.prototype.getMatchedSlice = function (title) {
        for (var _i = 0, _a = this.DB; _i < _a.length; _i++) {
            var teamArray = _a[_i];
            for (var _b = 0, teamArray_1 = teamArray; _b < teamArray_1.length; _b++) {
                var term = teamArray_1[_b];
                if (this.removeAccents(title.toLowerCase()).includes(term))
                    return term;
            }
        }
        return '';
    };
    TeamPredictor.prototype.verifyPossibleMismatches = function () {
        function verifyPair(a, b) {
            for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                var aTerm = a_1[_i];
                for (var _a = 0, b_1 = b; _a < b_1.length; _a++) {
                    var bTerm = b_1[_a];
                    if (aTerm.includes(bTerm) || bTerm.includes(aTerm))
                        return [false, aTerm.includes(bTerm), bTerm.includes(aTerm)];
                }
            }
            return [true, null, null];
        }
        for (var _i = 0, _a = this.DB; _i < _a.length; _i++) {
            var x = _a[_i];
            for (var _b = 0, _c = this.DB; _b < _c.length; _b++) {
                var y = _c[_b];
                if (x === y)
                    break;
                var result = verifyPair(x, y);
                if (!result[0]) {
                    console.log("POSSIBLE MISMATCH: " + x[0] + " && " + y[0]);
                    if (!(result[1] && result[2]))
                        console.log("\t\t" + (result[1] ? '1st includes 2nd' : '') + (result[2] ? '2nd includes 1st' : ''));
                    else
                        console.log('\t\t*** THEY\'RE EQUIVALENT ***');
                }
            }
        }
    };
    return TeamPredictor;
}());
_TeamPredictor_instances = new WeakSet(), _TeamPredictor_saveDB = function _TeamPredictor_saveDB() {
    fs.writeFileSync('./teams.db', this.DB.map(function (x) { return x.join(','); }).join(';'), { encoding: 'utf-8', flag: 'w' });
};
function sugestTitle(prodInfo, team, version) {
    if (version === void 0) { version = ''; }
    var usable_number = '';
    if (prodInfo.number != 'special')
        usable_number = prodInfo.number;
    var usable_kind = 'Camisa';
    if (prodInfo.flags.includes('windbreaker'))
        usable_kind = 'Corta Vento';
    else if (prodInfo.flags.includes('shorts'))
        usable_kind = 'Short';
    else if (prodInfo.flags.includes('kids'))
        usable_kind = 'Kit infantil';
    else if (prodInfo.flags.includes('jacket'))
        usable_kind = 'Jaqueta';
    var usable_retro = '';
    if (prodInfo.flags.includes('retro'))
        usable_retro = 'Retrô';
    var usable_longsleeves = '';
    if (prodInfo.flags.includes('long_sleeve'))
        usable_longsleeves = 'Mangas longas';
    var usable_year = prodInfo.year;
    if (prodInfo.year.length > 1)
        usable_year = prodInfo.year.join('/');
    var usable_training = '';
    if (prodInfo.flags.includes('training_suit'))
        usable_training = 'Treino';
    var usable_vest = '';
    if (prodInfo.flags.includes('vest'))
        usable_vest = 'Cavada';
    var usable_polo = '';
    if (prodInfo.flags.includes('polo'))
        usable_polo = 'Polo';
    var usable_woman = '';
    if (prodInfo.flags.includes('woman'))
        usable_woman = 'Feminina';
    var usable_goalkeeper = '';
    if (prodInfo.flags.includes('goalkeeper'))
        usable_goalkeeper = 'Goleiro';
    var usable_basketball = '';
    if (prodInfo.flags.includes('basketball'))
        usable_basketball = 'Basquete';
    // console.log(` KIND: ${usable_kind}`)
    // console.log(` NUMBER: ${usable_number}`)
    // console.log(` RETRO: ${usable_retro}`)
    // console.log(` YEAR: ${usable_year}`)
    var title = usable_kind + " " + usable_number + " " + usable_basketball + " " + usable_training + " " + usable_goalkeeper + " " + usable_longsleeves + " " + usable_polo + " " + usable_vest + " " + usable_retro + " " + team + " " + version + " " + usable_woman + " " + usable_year;
    title = title.trim();
    while (title.match(/  /)) // Tira os duplos, triplos, ..., espaços
        title = title.replaceAll('  ', ' ');
    return capitalizeWords(title);
}
function processTitle(title) {
    var prodInfo = {
        year: [],
        number: "",
        flags: []
    };
    prodInfo.year = getYearByTitle(title);
    prodInfo.flags = getFlagsByTitle(title);
    prodInfo.number = getNumberByTitle(title);
    return prodInfo;
}
function processMetaInfo(metainfo) {
    var s_metainfo = metainfo.split("~");
    return {
        hash: s_metainfo[0],
        title: s_metainfo[1],
        nimg: s_metainfo[2],
        main_image_id: s_metainfo[3]
    };
}
function includesAny(string, list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        term = list_1[_i];
        if (string.includes(term))
            return true;
    }
    return false;
}
function getDirImages(dir) {
    return fs.readdirSync(dir).filter(function (x) {
        var fileExtension = x.split('.')[x.split('.').length - 1];
        return (["jpg", "jpeg", "png"].some(function (ext) { return fileExtension == ext; }));
    });
}
function getDirMetaInfo(dir) {
    return fs.readFileSync(dir + '/' + 'meta.info', { encoding: 'utf8', flag: 'r' });
}
function getPrice(flags, prices) {
    for (var _i = 0, flags_1 = flags; _i < flags_1.length; _i++) {
        var flag = flags_1[_i];
        if (prices[flag] !== undefined)
            return prices[flag];
    }
}
function getYearByTitle(title) {
    var year = title.match(/[0-9]{2}\/[0-9]{2}/);
    if (!year)
        year = title.match(/[0-9]{4}/);
    if (year) {
        year = year[0];
        if (year.includes('/')) {
            var s_years = year.split('/');
            return [s_years[0] < 22 ? "20" + s_years[0] : "19" + s_years[0], s_years[0] < 22 ? "20" + s_years[1] : "19" + s_years[1]];
        }
        else
            return [year];
    }
    return [];
}
function getFlagsByTitle(title) {
    var flags = [];
    var lowercaseTitle = title.toLowerCase();
    var relations = [
        [
            "retro",
            ["retro"]
        ],
        [
            "special_edition",
            ["special edition"]
        ],
        [
            "training_suit",
            ["training suit", "training"]
        ],
        [
            "shorts",
            ["shorts"]
        ],
        [
            "player_version",
            ["player"]
        ],
        [
            "long_sleeve",
            ["long sleeve", "long-sleeved", "long sleeves"]
        ],
        [
            "goalkeeper",
            ["goalkeeper"]
        ],
        [
            "windbreaker",
            ["windbreaker"]
        ],
        [
            "all_sponsor",
            ["all sponsor"]
        ],
        [
            "concept_edition",
            ["concept edition"]
        ],
        [
            "basketball",
            ["basketball"]
        ],
        [
            "vest",
            ["vest"]
        ],
        [
            "kids",
            ["kids", "kid"]
        ],
        [
            "polo",
            ["polo"]
        ],
        [
            "woman",
            ["woman", "women"]
        ],
        [
            "jacket",
            ["jacket"]
        ]
    ];
    for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
        relation = relations_1[_i];
        if (includesAny(lowercaseTitle, relation[1]))
            flags.push(relation[0]);
    }
    if (!includesAny(flags, ["kids", "basketball", "player", "windbreaker", "shorts", "retro", "jacket"]))
        flags.push("jersey");
    return flags;
}
function getNumberByTitle(title) {
    var lowercaseTitle = title.toLowerCase();
    var relations = [
        ["4 away", "iv"],
        ["3 away", "iii"],
        ["fourth", "iv"],
        ["third", "iii"],
        ["away", "ii"],
        ["home", "i"]
    ].reverse();
    return relations.reduce(function (number, relation) {
        return lowercaseTitle.includes(" " + relation[0] + " ") ? relation[1] : number;
    }, 'special' /* Valor padrão */);
}
function capitalizeWords(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ').replaceAll("Iii", "III").replaceAll("Ii", "II").replaceAll("Iv", "IV");
}
module.exports = { sugestTitle: sugestTitle, processTitle: processTitle, processMetaInfo: processMetaInfo, includesAny: includesAny, getDirImages: getDirImages, getDirMetaInfo: getDirMetaInfo, getPrice: getPrice, getFlagsByTitle: getFlagsByTitle, teamPredictor: new TeamPredictor() };
