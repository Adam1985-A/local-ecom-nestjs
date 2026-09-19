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
exports.Vendor = void 0;
var typeorm_1 = require("typeorm");
var base_entity_js_1 = require("../common/entities/base.entity.js");
var business_type_enum_js_1 = require("../common/enums/business-type.enum.js");
var vendor_status_enum_js_1 = require("../common/enums/vendor-status.enum.js");
var Vendor = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('vendors')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_entity_js_1.BaseEntity;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _products_decorators;
    var _products_initializers = [];
    var _products_extraInitializers = [];
    var _carts_decorators;
    var _carts_initializers = [];
    var _carts_extraInitializers = [];
    var _businessName_decorators;
    var _businessName_initializers = [];
    var _businessName_extraInitializers = [];
    var _businessType_decorators;
    var _businessType_initializers = [];
    var _businessType_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _coverImageUrl_decorators;
    var _coverImageUrl_initializers = [];
    var _coverImageUrl_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
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
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejectionReason_decorators;
    var _rejectionReason_initializers = [];
    var _rejectionReason_extraInitializers = [];
    var _isOpen_decorators;
    var _isOpen_initializers = [];
    var _isOpen_extraInitializers = [];
    var _openingTime_decorators;
    var _openingTime_initializers = [];
    var _openingTime_extraInitializers = [];
    var _closingTime_decorators;
    var _closingTime_initializers = [];
    var _closingTime_extraInitializers = [];
    var _minimumOrderAmount_decorators;
    var _minimumOrderAmount_initializers = [];
    var _minimumOrderAmount_extraInitializers = [];
    var _commissionRate_decorators;
    var _commissionRate_initializers = [];
    var _commissionRate_extraInitializers = [];
    var _averageRating_decorators;
    var _averageRating_initializers = [];
    var _averageRating_extraInitializers = [];
    var _totalReviews_decorators;
    var _totalReviews_initializers = [];
    var _totalReviews_extraInitializers = [];
    var Vendor = _classThis = /** @class */ (function (_super) {
        __extends(Vendor_1, _super);
        function Vendor_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.userId = __runInitializers(_this, _userId_initializers, void 0);
            _this.user = (__runInitializers(_this, _userId_extraInitializers), __runInitializers(_this, _user_initializers, void 0));
            _this.products = (__runInitializers(_this, _user_extraInitializers), __runInitializers(_this, _products_initializers, void 0));
            _this.carts = (__runInitializers(_this, _products_extraInitializers), __runInitializers(_this, _carts_initializers, void 0));
            _this.businessName = (__runInitializers(_this, _carts_extraInitializers), __runInitializers(_this, _businessName_initializers, void 0));
            _this.businessType = (__runInitializers(_this, _businessName_extraInitializers), __runInitializers(_this, _businessType_initializers, void 0));
            _this.description = (__runInitializers(_this, _businessType_extraInitializers), __runInitializers(_this, _description_initializers, void 0));
            _this.logoUrl = (__runInitializers(_this, _description_extraInitializers), __runInitializers(_this, _logoUrl_initializers, void 0));
            _this.coverImageUrl = (__runInitializers(_this, _logoUrl_extraInitializers), __runInitializers(_this, _coverImageUrl_initializers, void 0));
            _this.phone = (__runInitializers(_this, _coverImageUrl_extraInitializers), __runInitializers(_this, _phone_initializers, void 0));
            _this.address = (__runInitializers(_this, _phone_extraInitializers), __runInitializers(_this, _address_initializers, void 0));
            _this.city = (__runInitializers(_this, _address_extraInitializers), __runInitializers(_this, _city_initializers, void 0));
            _this.state = (__runInitializers(_this, _city_extraInitializers), __runInitializers(_this, _state_initializers, void 0));
            _this.latitude = (__runInitializers(_this, _state_extraInitializers), __runInitializers(_this, _latitude_initializers, void 0));
            _this.longitude = (__runInitializers(_this, _latitude_extraInitializers), __runInitializers(_this, _longitude_initializers, void 0));
            _this.status = (__runInitializers(_this, _longitude_extraInitializers), __runInitializers(_this, _status_initializers, void 0));
            _this.rejectionReason = (__runInitializers(_this, _status_extraInitializers), __runInitializers(_this, _rejectionReason_initializers, null));
            _this.isOpen = (__runInitializers(_this, _rejectionReason_extraInitializers), __runInitializers(_this, _isOpen_initializers, void 0));
            _this.openingTime = (__runInitializers(_this, _isOpen_extraInitializers), __runInitializers(_this, _openingTime_initializers, void 0));
            _this.closingTime = (__runInitializers(_this, _openingTime_extraInitializers), __runInitializers(_this, _closingTime_initializers, void 0));
            _this.minimumOrderAmount = (__runInitializers(_this, _closingTime_extraInitializers), __runInitializers(_this, _minimumOrderAmount_initializers, void 0));
            _this.commissionRate = (__runInitializers(_this, _minimumOrderAmount_extraInitializers), __runInitializers(_this, _commissionRate_initializers, void 0));
            _this.averageRating = (__runInitializers(_this, _commissionRate_extraInitializers), __runInitializers(_this, _averageRating_initializers, void 0));
            _this.totalReviews = (__runInitializers(_this, _averageRating_extraInitializers), __runInitializers(_this, _totalReviews_initializers, void 0));
            __runInitializers(_this, _totalReviews_extraInitializers);
            return _this;
        }
        return Vendor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Vendor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _userId_decorators = [(0, typeorm_1.Index)({ unique: true }), (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)('User', { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'user_id' })];
        _products_decorators = [(0, typeorm_1.OneToMany)('Product', function (product) { return product.vendor; })];
        _carts_decorators = [(0, typeorm_1.OneToMany)('Cart', function (cart) { return cart.vendor; })];
        _businessName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', name: 'business_name' })];
        _businessType_decorators = [(0, typeorm_1.Index)(), (0, typeorm_1.Column)({ name: 'business_type', type: 'enum', enum: business_type_enum_js_1.BusinessType })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _logoUrl_decorators = [(0, typeorm_1.Column)({ type: 'varchar', name: 'logo_url', nullable: true })];
        _coverImageUrl_decorators = [(0, typeorm_1.Column)({ type: 'varchar', name: 'cover_image_url', nullable: true })];
        _phone_decorators = [(0, typeorm_1.Column)({ type: 'varchar' })];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'varchar' })];
        _city_decorators = [(0, typeorm_1.Column)({ type: 'varchar' })];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'varchar' })];
        _latitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true })];
        _longitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true })];
        _status_decorators = [(0, typeorm_1.Index)(), (0, typeorm_1.Column)({ type: 'enum', enum: vendor_status_enum_js_1.VendorStatus, default: vendor_status_enum_js_1.VendorStatus.PENDING })];
        _rejectionReason_decorators = [(0, typeorm_1.Column)({ type: 'text', name: 'rejection_reason', nullable: true })];
        _isOpen_decorators = [(0, typeorm_1.Column)({ type: 'boolean', name: 'is_open', default: true })];
        _openingTime_decorators = [(0, typeorm_1.Column)({ name: 'opening_time', type: 'time', nullable: true })];
        _closingTime_decorators = [(0, typeorm_1.Column)({ name: 'closing_time', type: 'time', nullable: true })];
        _minimumOrderAmount_decorators = [(0, typeorm_1.Column)({ name: 'minimum_order_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })];
        _commissionRate_decorators = [(0, typeorm_1.Column)({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 10 })];
        _averageRating_decorators = [(0, typeorm_1.Column)({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })];
        _totalReviews_decorators = [(0, typeorm_1.Column)({ name: 'total_reviews', type: 'int', default: 0 })];
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _products_decorators, { kind: "field", name: "products", static: false, private: false, access: { has: function (obj) { return "products" in obj; }, get: function (obj) { return obj.products; }, set: function (obj, value) { obj.products = value; } }, metadata: _metadata }, _products_initializers, _products_extraInitializers);
        __esDecorate(null, null, _carts_decorators, { kind: "field", name: "carts", static: false, private: false, access: { has: function (obj) { return "carts" in obj; }, get: function (obj) { return obj.carts; }, set: function (obj, value) { obj.carts = value; } }, metadata: _metadata }, _carts_initializers, _carts_extraInitializers);
        __esDecorate(null, null, _businessName_decorators, { kind: "field", name: "businessName", static: false, private: false, access: { has: function (obj) { return "businessName" in obj; }, get: function (obj) { return obj.businessName; }, set: function (obj, value) { obj.businessName = value; } }, metadata: _metadata }, _businessName_initializers, _businessName_extraInitializers);
        __esDecorate(null, null, _businessType_decorators, { kind: "field", name: "businessType", static: false, private: false, access: { has: function (obj) { return "businessType" in obj; }, get: function (obj) { return obj.businessType; }, set: function (obj, value) { obj.businessType = value; } }, metadata: _metadata }, _businessType_initializers, _businessType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
        __esDecorate(null, null, _coverImageUrl_decorators, { kind: "field", name: "coverImageUrl", static: false, private: false, access: { has: function (obj) { return "coverImageUrl" in obj; }, get: function (obj) { return obj.coverImageUrl; }, set: function (obj, value) { obj.coverImageUrl = value; } }, metadata: _metadata }, _coverImageUrl_initializers, _coverImageUrl_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: function (obj) { return "rejectionReason" in obj; }, get: function (obj) { return obj.rejectionReason; }, set: function (obj, value) { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _isOpen_decorators, { kind: "field", name: "isOpen", static: false, private: false, access: { has: function (obj) { return "isOpen" in obj; }, get: function (obj) { return obj.isOpen; }, set: function (obj, value) { obj.isOpen = value; } }, metadata: _metadata }, _isOpen_initializers, _isOpen_extraInitializers);
        __esDecorate(null, null, _openingTime_decorators, { kind: "field", name: "openingTime", static: false, private: false, access: { has: function (obj) { return "openingTime" in obj; }, get: function (obj) { return obj.openingTime; }, set: function (obj, value) { obj.openingTime = value; } }, metadata: _metadata }, _openingTime_initializers, _openingTime_extraInitializers);
        __esDecorate(null, null, _closingTime_decorators, { kind: "field", name: "closingTime", static: false, private: false, access: { has: function (obj) { return "closingTime" in obj; }, get: function (obj) { return obj.closingTime; }, set: function (obj, value) { obj.closingTime = value; } }, metadata: _metadata }, _closingTime_initializers, _closingTime_extraInitializers);
        __esDecorate(null, null, _minimumOrderAmount_decorators, { kind: "field", name: "minimumOrderAmount", static: false, private: false, access: { has: function (obj) { return "minimumOrderAmount" in obj; }, get: function (obj) { return obj.minimumOrderAmount; }, set: function (obj, value) { obj.minimumOrderAmount = value; } }, metadata: _metadata }, _minimumOrderAmount_initializers, _minimumOrderAmount_extraInitializers);
        __esDecorate(null, null, _commissionRate_decorators, { kind: "field", name: "commissionRate", static: false, private: false, access: { has: function (obj) { return "commissionRate" in obj; }, get: function (obj) { return obj.commissionRate; }, set: function (obj, value) { obj.commissionRate = value; } }, metadata: _metadata }, _commissionRate_initializers, _commissionRate_extraInitializers);
        __esDecorate(null, null, _averageRating_decorators, { kind: "field", name: "averageRating", static: false, private: false, access: { has: function (obj) { return "averageRating" in obj; }, get: function (obj) { return obj.averageRating; }, set: function (obj, value) { obj.averageRating = value; } }, metadata: _metadata }, _averageRating_initializers, _averageRating_extraInitializers);
        __esDecorate(null, null, _totalReviews_decorators, { kind: "field", name: "totalReviews", static: false, private: false, access: { has: function (obj) { return "totalReviews" in obj; }, get: function (obj) { return obj.totalReviews; }, set: function (obj, value) { obj.totalReviews = value; } }, metadata: _metadata }, _totalReviews_initializers, _totalReviews_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Vendor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Vendor = _classThis;
}();
exports.Vendor = Vendor;
