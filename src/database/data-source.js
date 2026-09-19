"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
var node_url_1 = require("node:url");
var node_path_1 = require("node:path");
(0, dotenv_1.config)();
var _filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var _dirname = (0, node_path_1.dirname)(_filename);
var databaseUrl = process.env.DATABASE_URL;
exports.AppDataSource = new typeorm_1.DataSource(__assign(__assign({ type: 'postgres' }, (databaseUrl
    ? {
        url: databaseUrl,
    }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'local-ecom-nestjs',
    })), { entities: [(0, node_path_1.join)(_dirname, '../**/*.entity{.ts,.js}')], migrations: [(0, node_path_1.join)(_dirname, 'migration/*{.ts,.js}')], synchronize: false, ssl: process.env.DB_SSL === 'true' ?
        { rejectUnauthorized: false }
        : false }));
