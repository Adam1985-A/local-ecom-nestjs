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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUsers = seedAdminUsers;
var bcrypt = require("bcryptjs");
var user_entity_js_1 = require("../../users/user.entity.js");
var user_role_enum_js_1 = require("../../common/enums/user.role.enum.js");
var ADMINS = [
    {
        email: 'superadmin@localessentials.com',
        password: 'SuperAdmin123!',
        firstName: 'Super',
        lastName: 'Admin',
        role: user_role_enum_js_1.UserRole.SUPER_ADMIN,
    },
    {
        email: 'admin@localessentials.com',
        password: 'Admin123!',
        firstName: 'Platform',
        lastName: 'Admin',
        role: user_role_enum_js_1.UserRole.ADMIN,
    },
];
/**
 * Seeds initial admin and super-admin accounts.
 * Safe to run multiple times — skips existing emails.
 *
 * ⚠️  Change the default passwords immediately after seeding in any
 *      non-development environment.
 */
function seedAdminUsers(dataSource) {
    return __awaiter(this, void 0, void 0, function () {
        var repo, created, _i, ADMINS_1, data, existing, user, _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    repo = dataSource.getRepository(user_entity_js_1.User);
                    created = [];
                    _i = 0, ADMINS_1 = ADMINS;
                    _f.label = 1;
                case 1:
                    if (!(_i < ADMINS_1.length)) return [3 /*break*/, 6];
                    data = ADMINS_1[_i];
                    return [4 /*yield*/, repo.findOne({ where: { email: data.email } })];
                case 2:
                    existing = _f.sent();
                    if (existing) {
                        console.log("  \u26A0\uFE0F  ".concat(data.email, " already exists \u2014 skipping"));
                        return [3 /*break*/, 5];
                    }
                    _b = (_a = repo).save;
                    _d = (_c = repo).create;
                    _e = {
                        email: data.email
                    };
                    return [4 /*yield*/, bcrypt.hash(data.password, 10)];
                case 3: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [(_e.password = _f.sent(),
                                _e.firstName = data.firstName,
                                _e.lastName = data.lastName,
                                _e.role = data.role,
                                _e.isActive = true,
                                _e.isEmailVerified = true,
                                _e)])])];
                case 4:
                    user = _f.sent();
                    created.push(user);
                    console.log("  \u2705 Created ".concat(data.role, ": ").concat(data.email, "  password: ").concat(data.password));
                    console.log("     \u26A0\uFE0F  Change this password immediately in production!");
                    _f.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, created];
            }
        });
    });
}
