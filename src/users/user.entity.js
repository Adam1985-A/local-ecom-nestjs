"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var cart_entity_js_1 = require("../cart/cart.entity.js");
var base_entity_js_1 = require("../common/entities/base.entity.js");
var user_role_enum_js_1 = require("../common/enums/user.role.enum.js");
var User = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_entity_js_1.BaseEntity;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _carts_decorators;
    var _carts_initializers = [];
    var _carts_extraInitializers = [];
    var _vendors_decorators;
    var _vendors_initializers = [];
    var _vendors_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _avatarUrl_decorators;
    var _avatarUrl_initializers = [];
    var _avatarUrl_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _isEmailVerified_decorators;
    var _isEmailVerified_initializers = [];
    var _isEmailVerified_extraInitializers = [];
    var _isPhoneVerified_decorators;
    var _isPhoneVerified_initializers = [];
    var _isPhoneVerified_extraInitializers = [];
    var _refreshTokenHash_decorators;
    var _refreshTokenHash_initializers = [];
    var _refreshTokenHash_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var User = _classThis = /** @class */ (function (_super) {
        __extends(User_1, _super);
        function User_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.email = __runInitializers(_this, _email_initializers, void 0);
            _this.phone = (__runInitializers(_this, _email_extraInitializers), __runInitializers(_this, _phone_initializers, void 0));
            _this.carts = (__runInitializers(_this, _phone_extraInitializers), __runInitializers(_this, _carts_initializers, void 0));
            _this.vendors = (__runInitializers(_this, _carts_extraInitializers), __runInitializers(_this, _vendors_initializers, void 0));
            _this.password = (__runInitializers(_this, _vendors_extraInitializers), __runInitializers(_this, _password_initializers, void 0));
            _this.firstName = (__runInitializers(_this, _password_extraInitializers), __runInitializers(_this, _firstName_initializers, void 0));
            _this.lastName = (__runInitializers(_this, _firstName_extraInitializers), __runInitializers(_this, _lastName_initializers, void 0));
            _this.role = (__runInitializers(_this, _lastName_extraInitializers), __runInitializers(_this, _role_initializers, void 0));
            _this.avatarUrl = (__runInitializers(_this, _role_extraInitializers), __runInitializers(_this, _avatarUrl_initializers, void 0));
            _this.isActive = (__runInitializers(_this, _avatarUrl_extraInitializers), __runInitializers(_this, _isActive_initializers, void 0));
            _this.isEmailVerified = (__runInitializers(_this, _isActive_extraInitializers), __runInitializers(_this, _isEmailVerified_initializers, void 0));
            _this.isPhoneVerified = (__runInitializers(_this, _isEmailVerified_extraInitializers), __runInitializers(_this, _isPhoneVerified_initializers, void 0));
            _this.refreshTokenHash = (__runInitializers(_this, _isPhoneVerified_extraInitializers), __runInitializers(_this, _refreshTokenHash_initializers, void 0));
            _this.address = (__runInitializers(_this, _refreshTokenHash_extraInitializers), __runInitializers(_this, _address_initializers, void 0));
            _this.city = (__runInitializers(_this, _address_extraInitializers), __runInitializers(_this, _city_initializers, void 0));
            _this.state = (__runInitializers(_this, _city_extraInitializers), __runInitializers(_this, _state_initializers, void 0));
            _this.latitude = (__runInitializers(_this, _state_extraInitializers), __runInitializers(_this, _latitude_initializers, void 0));
            _this.longitude = (__runInitializers(_this, _latitude_extraInitializers), __runInitializers(_this, _longitude_initializers, void 0));
            __runInitializers(_this, _longitude_extraInitializers);
            return _this;
        }
        Object.defineProperty(User_1.prototype, "fullName", {
            get: function () {
                return "".concat(this.firstName, " ").concat(this.lastName);
            },
            enumerable: false,
            configurable: true
        });
        return User_1;
    }(_classSuper));
    __setFunctionName(_classThis, "User");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _email_decorators = [(0, typeorm_1.Index)({ unique: true }), (0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _phone_decorators = [(0, typeorm_1.Index)({ unique: true }), (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true })];
        _carts_decorators = [(0, typeorm_1.OneToMany)(function () { return cart_entity_js_1.Cart; }, function (cart) { return cart.user; })];
        _vendors_decorators = [(0, typeorm_1.OneToMany)('Vendor', function (vendor) { return vendor.user; })];
        _password_decorators = [(0, typeorm_1.Column)({ type: 'varchar', select: false })];
        _firstName_decorators = [(0, typeorm_1.Column)({ type: 'text', name: 'first_name' })];
        _lastName_decorators = [(0, typeorm_1.Column)({ type: 'text', name: 'last_name' })];
        _role_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: user_role_enum_js_1.UserRole, default: user_role_enum_js_1.UserRole.CUSTOMER })];
        _avatarUrl_decorators = [(0, typeorm_1.Column)({ name: 'avatar_url', type: 'varchar', nullable: true })];
        _isActive_decorators = [(0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true })];
        _isEmailVerified_decorators = [(0, typeorm_1.Column)({ name: 'is_email_verified', type: 'boolean', default: false })];
        _isPhoneVerified_decorators = [(0, typeorm_1.Column)({ name: 'is_phone_verified', type: 'boolean', default: false })];
        _refreshTokenHash_decorators = [(0, typeorm_1.Column)({ name: 'refresh_token_hash', type: 'varchar', select: false, nullable: true })];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _city_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _latitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true })];
        _longitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true })];
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _carts_decorators, { kind: "field", name: "carts", static: false, private: false, access: { has: function (obj) { return "carts" in obj; }, get: function (obj) { return obj.carts; }, set: function (obj, value) { obj.carts = value; } }, metadata: _metadata }, _carts_initializers, _carts_extraInitializers);
        __esDecorate(null, null, _vendors_decorators, { kind: "field", name: "vendors", static: false, private: false, access: { has: function (obj) { return "vendors" in obj; }, get: function (obj) { return obj.vendors; }, set: function (obj, value) { obj.vendors = value; } }, metadata: _metadata }, _vendors_initializers, _vendors_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: function (obj) { return "avatarUrl" in obj; }, get: function (obj) { return obj.avatarUrl; }, set: function (obj, value) { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _isEmailVerified_decorators, { kind: "field", name: "isEmailVerified", static: false, private: false, access: { has: function (obj) { return "isEmailVerified" in obj; }, get: function (obj) { return obj.isEmailVerified; }, set: function (obj, value) { obj.isEmailVerified = value; } }, metadata: _metadata }, _isEmailVerified_initializers, _isEmailVerified_extraInitializers);
        __esDecorate(null, null, _isPhoneVerified_decorators, { kind: "field", name: "isPhoneVerified", static: false, private: false, access: { has: function (obj) { return "isPhoneVerified" in obj; }, get: function (obj) { return obj.isPhoneVerified; }, set: function (obj, value) { obj.isPhoneVerified = value; } }, metadata: _metadata }, _isPhoneVerified_initializers, _isPhoneVerified_extraInitializers);
        __esDecorate(null, null, _refreshTokenHash_decorators, { kind: "field", name: "refreshTokenHash", static: false, private: false, access: { has: function (obj) { return "refreshTokenHash" in obj; }, get: function (obj) { return obj.refreshTokenHash; }, set: function (obj, value) { obj.refreshTokenHash = value; } }, metadata: _metadata }, _refreshTokenHash_initializers, _refreshTokenHash_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
