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
exports.Product = void 0;
var typeorm_1 = require("typeorm");
var cart_item_entity_js_1 = require("../cart/cart-item.entity.js");
var base_entity_js_1 = require("../common/entities/base.entity.js");
var category_entity_js_1 = require("../categories/category.entity.js");
var Product = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('products')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_entity_js_1.BaseEntity;
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _vendor_decorators;
    var _vendor_initializers = [];
    var _vendor_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _cartItems_decorators;
    var _cartItems_initializers = [];
    var _cartItems_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _discountedPrice_decorators;
    var _discountedPrice_initializers = [];
    var _discountedPrice_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _imagePublicId_decorators;
    var _imagePublicId_initializers = [];
    var _imagePublicId_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _averageRating_decorators;
    var _averageRating_initializers = [];
    var _averageRating_extraInitializers = [];
    var _totalReviews_decorators;
    var _totalReviews_initializers = [];
    var _totalReviews_extraInitializers = [];
    var Product = _classThis = /** @class */ (function (_super) {
        __extends(Product_1, _super);
        function Product_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.vendorId = __runInitializers(_this, _vendorId_initializers, void 0);
            _this.vendor = (__runInitializers(_this, _vendorId_extraInitializers), __runInitializers(_this, _vendor_initializers, void 0));
            _this.categoryId = (__runInitializers(_this, _vendor_extraInitializers), __runInitializers(_this, _categoryId_initializers, void 0));
            _this.category = (__runInitializers(_this, _categoryId_extraInitializers), __runInitializers(_this, _category_initializers, void 0));
            _this.cartItems = (__runInitializers(_this, _category_extraInitializers), __runInitializers(_this, _cartItems_initializers, void 0));
            _this.name = (__runInitializers(_this, _cartItems_extraInitializers), __runInitializers(_this, _name_initializers, void 0));
            _this.slug = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _slug_initializers, void 0));
            _this.description = (__runInitializers(_this, _slug_extraInitializers), __runInitializers(_this, _description_initializers, void 0));
            _this.price = (__runInitializers(_this, _description_extraInitializers), __runInitializers(_this, _price_initializers, void 0));
            _this.discountedPrice = (__runInitializers(_this, _price_extraInitializers), __runInitializers(_this, _discountedPrice_initializers, void 0));
            _this.imageUrl = (__runInitializers(_this, _discountedPrice_extraInitializers), __runInitializers(_this, _imageUrl_initializers, void 0));
            _this.imagePublicId = (__runInitializers(_this, _imageUrl_extraInitializers), __runInitializers(_this, _imagePublicId_initializers, void 0));
            _this.unit = (__runInitializers(_this, _imagePublicId_extraInitializers), __runInitializers(_this, _unit_initializers, void 0));
            _this.isActive = (__runInitializers(_this, _unit_extraInitializers), __runInitializers(_this, _isActive_initializers, void 0));
            _this.averageRating = (__runInitializers(_this, _isActive_extraInitializers), __runInitializers(_this, _averageRating_initializers, void 0));
            _this.totalReviews = (__runInitializers(_this, _averageRating_extraInitializers), __runInitializers(_this, _totalReviews_initializers, void 0));
            __runInitializers(_this, _totalReviews_extraInitializers);
            return _this;
        }
        Object.defineProperty(Product_1.prototype, "effectivePrice", {
            get: function () {
                return this.discountedPrice !== undefined && this.discountedPrice !== null ?
                    Number(this.discountedPrice) : Number(this.price);
            },
            enumerable: false,
            configurable: true
        });
        return Product_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Product");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _vendorId_decorators = [(0, typeorm_1.Index)(), (0, typeorm_1.Column)({ name: 'vendor_id', type: 'uuid' })];
        _vendor_decorators = [(0, typeorm_1.ManyToOne)('Vendor', { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'vendor_id' })];
        _categoryId_decorators = [(0, typeorm_1.Column)({ name: 'category_id', type: 'uuid' })];
        _category_decorators = [(0, typeorm_1.ManyToOne)(function () { return category_entity_js_1.Category; }, { onDelete: 'RESTRICT' }), (0, typeorm_1.JoinColumn)({ name: 'category_id' })];
        _cartItems_decorators = [(0, typeorm_1.OneToMany)(function () { return cart_item_entity_js_1.CartItem; }, function (item) { return item.product; })];
        _name_decorators = [(0, typeorm_1.Column)({ type: 'varchar' })];
        _slug_decorators = [(0, typeorm_1.Index)({ unique: true }), (0, typeorm_1.Column)({ type: 'varchar' })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _price_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 })];
        _discountedPrice_decorators = [(0, typeorm_1.Column)({ name: 'discounted_price', type: 'decimal', precision: 12, scale: 2, nullable: true })];
        _imageUrl_decorators = [(0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', nullable: true })];
        _imagePublicId_decorators = [(0, typeorm_1.Column)({ name: 'image_public_id', type: 'varchar', nullable: true })];
        _unit_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _isActive_decorators = [(0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true })];
        _averageRating_decorators = [(0, typeorm_1.Column)({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })];
        _totalReviews_decorators = [(0, typeorm_1.Column)({ name: 'total_reviews', type: 'int', default: 0 })];
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: function (obj) { return "vendor" in obj; }, get: function (obj) { return obj.vendor; }, set: function (obj, value) { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _cartItems_decorators, { kind: "field", name: "cartItems", static: false, private: false, access: { has: function (obj) { return "cartItems" in obj; }, get: function (obj) { return obj.cartItems; }, set: function (obj, value) { obj.cartItems = value; } }, metadata: _metadata }, _cartItems_initializers, _cartItems_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _discountedPrice_decorators, { kind: "field", name: "discountedPrice", static: false, private: false, access: { has: function (obj) { return "discountedPrice" in obj; }, get: function (obj) { return obj.discountedPrice; }, set: function (obj, value) { obj.discountedPrice = value; } }, metadata: _metadata }, _discountedPrice_initializers, _discountedPrice_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _imagePublicId_decorators, { kind: "field", name: "imagePublicId", static: false, private: false, access: { has: function (obj) { return "imagePublicId" in obj; }, get: function (obj) { return obj.imagePublicId; }, set: function (obj, value) { obj.imagePublicId = value; } }, metadata: _metadata }, _imagePublicId_initializers, _imagePublicId_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _averageRating_decorators, { kind: "field", name: "averageRating", static: false, private: false, access: { has: function (obj) { return "averageRating" in obj; }, get: function (obj) { return obj.averageRating; }, set: function (obj, value) { obj.averageRating = value; } }, metadata: _metadata }, _averageRating_initializers, _averageRating_extraInitializers);
        __esDecorate(null, null, _totalReviews_decorators, { kind: "field", name: "totalReviews", static: false, private: false, access: { has: function (obj) { return "totalReviews" in obj; }, get: function (obj) { return obj.totalReviews; }, set: function (obj, value) { obj.totalReviews = value; } }, metadata: _metadata }, _totalReviews_initializers, _totalReviews_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Product = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Product = _classThis;
}();
exports.Product = Product;
