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
exports.CartItem = void 0;
var typeorm_1 = require("typeorm");
var base_entity_js_1 = require("../common/entities/base.entity.js");
var CartItem = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('cart_items')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_entity_js_1.BaseEntity;
    var _cartId_decorators;
    var _cartId_initializers = [];
    var _cartId_extraInitializers = [];
    var _cart_decorators;
    var _cart_initializers = [];
    var _cart_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _product_decorators;
    var _product_initializers = [];
    var _product_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var _unitPrice_decorators;
    var _unitPrice_initializers = [];
    var _unitPrice_extraInitializers = [];
    var CartItem = _classThis = /** @class */ (function (_super) {
        __extends(CartItem_1, _super);
        function CartItem_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cartId = __runInitializers(_this, _cartId_initializers, void 0);
            _this.cart = (__runInitializers(_this, _cartId_extraInitializers), __runInitializers(_this, _cart_initializers, void 0));
            _this.productId = (__runInitializers(_this, _cart_extraInitializers), __runInitializers(_this, _productId_initializers, void 0));
            _this.product = (__runInitializers(_this, _productId_extraInitializers), __runInitializers(_this, _product_initializers, void 0));
            _this.quantity = (__runInitializers(_this, _product_extraInitializers), __runInitializers(_this, _quantity_initializers, void 0));
            _this.unitPrice = (__runInitializers(_this, _quantity_extraInitializers), __runInitializers(_this, _unitPrice_initializers, void 0));
            __runInitializers(_this, _unitPrice_extraInitializers);
            return _this;
        }
        Object.defineProperty(CartItem_1.prototype, "subtotal", {
            get: function () {
                return Number(this.unitPrice) * this.quantity;
            },
            enumerable: false,
            configurable: true
        });
        return CartItem_1;
    }(_classSuper));
    __setFunctionName(_classThis, "CartItem");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _cartId_decorators = [(0, typeorm_1.Column)({ name: 'cart_id', type: 'uuid' })];
        _cart_decorators = [(0, typeorm_1.ManyToOne)('Cart', function (cart) { return cart.items; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'cart_id' })];
        _productId_decorators = [(0, typeorm_1.Column)({ name: 'product_id', type: 'uuid' })];
        _product_decorators = [(0, typeorm_1.ManyToOne)('Product', { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'product_id' })];
        _quantity_decorators = [(0, typeorm_1.Column)({ type: 'int' })];
        _unitPrice_decorators = [(0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })];
        __esDecorate(null, null, _cartId_decorators, { kind: "field", name: "cartId", static: false, private: false, access: { has: function (obj) { return "cartId" in obj; }, get: function (obj) { return obj.cartId; }, set: function (obj, value) { obj.cartId = value; } }, metadata: _metadata }, _cartId_initializers, _cartId_extraInitializers);
        __esDecorate(null, null, _cart_decorators, { kind: "field", name: "cart", static: false, private: false, access: { has: function (obj) { return "cart" in obj; }, get: function (obj) { return obj.cart; }, set: function (obj, value) { obj.cart = value; } }, metadata: _metadata }, _cart_initializers, _cart_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: function (obj) { return "product" in obj; }, get: function (obj) { return obj.product; }, set: function (obj, value) { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: function (obj) { return "unitPrice" in obj; }, get: function (obj) { return obj.unitPrice; }, set: function (obj, value) { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartItem = _classThis;
}();
exports.CartItem = CartItem;
