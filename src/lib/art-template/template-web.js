/*! art-template@4.13.1 for browser | https://github.com/aui/art-template */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["template"] = factory();
	else
		root["template"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Compiler = __webpack_require__(6);
const defaults = __webpack_require__(2);
const TemplateError = __webpack_require__(22);

const debugRender = (error, options) => {
    options.onerror(error, options);
    const render = () => `{Template Error}`;
    render.mappings = [];
    render.sourcesContent = [];
    return render;
};

/**
 * 编译模版
 * @param {string|Object} source   模板内容
 * @param {?Object}       options  编译选项
 * @return {function}
 */
const compile = (source, options = {}) => {
    if (typeof source !== 'string') {
        options = source;
    } else {
        options.source = source;
    }

    // 合并默认配置
    options = defaults.$extend(options);
    source = options.source;

    // debug 模式
    /* istanbul ignore if */
    if (options.debug === true) {
        options.cache = false;
        options.minimize = false;
        options.compileDebug = true;
    }

    if (options.compileDebug) {
        options.minimize = false;
    }

    // 转换成绝对路径
    if (options.filename) {
        options.filename = options.resolveFilename(options.filename, options);
    }

    const filename = options.filename;
    const cache = options.cache;
    const caches = options.caches;

    // 匹配缓存
    if (cache && filename) {
        const render = caches.get(filename);
        if (render) {
            return render;
        }
    }

    // 加载外部模板
    if (!source) {
        try {
            source = options.loader(filename, options);
            options.source = source;
        } catch (e) {
            const error = new TemplateError({
                name: 'CompileError',
                path: filename,
                message: `template not found: ${e.message}`,
                stack: e.stack
            });

            if (options.bail) {
                throw error;
            } else {
                return debugRender(error, options);
            }
        }
    }

    let fn;
    const compiler = new Compiler(options);

    try {
        fn = compiler.build();
    } catch (error) {
        error = new TemplateError(error);
        if (options.bail) {
            throw error;
        } else {
            return debugRender(error, options);
        }
    }

    const render = (data, blocks) => {
        try {
            return fn(data, blocks);
        } catch (error) {
            // 运行时出错以调试模式重载
            if (!options.compileDebug) {
                options.cache = false;
                options.compileDebug = true;
                return compile(options)(data, blocks);
            }

            error = new TemplateError(error);

            if (options.bail) {
                throw error;
            } else {
                return debugRender(error, options)();
            }
        }
    };

    render.mappings = fn.mappings;
    render.sourcesContent = fn.sourcesContent;
    render.toString = () => fn.toString();

    if (cache && filename) {
        caches.set(filename, render);
    }

    return render;
};

compile.Compiler = Compiler;

module.exports = compile;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Copyright 2014, 2015, 2016, 2017 Simon Lydell
// License: MIT. (See LICENSE.)

Object.defineProperty(exports, "__esModule", {
  value: true
})

// This regex comes from regex.coffee, and is inserted here by generate-index.js
// (run `npm run build`).
exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g

exports.matchToToken = function(match) {
  var token = {type: "invalid", value: match[0]}
       if (match[ 1]) token.type = "string" , token.closed = !!(match[3] || match[4])
  else if (match[ 5]) token.type = "comment"
  else if (match[ 6]) token.type = "comment", token.closed = !!match[7]
  else if (match[ 8]) token.type = "regex"
  else if (match[ 9]) token.type = "number"
  else if (match[10]) token.type = "name"
  else if (match[11]) token.type = "punctuator"
  else if (match[12]) token.type = "whitespace"
  return token
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const runtime = __webpack_require__(10);
const extend = __webpack_require__(12);
const include = __webpack_require__(13);
const onerror = __webpack_require__(14);
const caches = __webpack_require__(15);
const loader = __webpack_require__(16);
const artRule = __webpack_require__(17);
const nativeRule = __webpack_require__(18);
const htmlMinifier = __webpack_require__(19);
const resolveFilename = __webpack_require__(21);

const detectNode = typeof window === 'undefined';

/** 模板编译器默认配置 */
const settings = {
    // 模板内容。如果没有此字段，则会根据 filename 来加载模板内容
    source: null,

    // 模板名
    filename: null,

    // 模板语法规则列表
    rules: [nativeRule, artRule],

    // 是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
    // escape 可以防范 XSS 攻击
    escape: true,

    // 启动模板引擎调试模式。如果为 true: {cache:false, minimize:false, compileDebug:true}
    debug: detectNode ? process.env.NODE_ENV !== 'production' : false,

    // bail 如果为 true，编译错误与运行时错误都会抛出异常
    bail: true,

    // 是否开启缓存
    cache: true,

    // 是否开启压缩。它会运行 htmlMinifier，将页面 HTML、CSS、CSS 进行压缩输出
    // 如果模板包含没有闭合的 HTML 标签，请不要打开 minimize，否则可能被 htmlMinifier 修复或过滤
    minimize: true,

    // 是否编译调试版
    compileDebug: false,

    // 模板路径转换器
    resolveFilename: resolveFilename,

    // 子模板编译适配器
    include: include,

    // HTML 压缩器。仅在 NodeJS 环境下有效
    htmlMinifier: htmlMinifier,

    // HTML 压缩器配置。参见 https://github.com/kangax/html-minifier
    htmlMinifierOptions: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        // 运行时自动合并：rules.map(rule => rule.test)
        ignoreCustomFragments: []
    },

    // 错误事件。仅在 bail 为 false 时生效
    onerror: onerror,

    // 模板文件加载器
    loader: loader,

    // 缓存中心适配器（依赖 filename 字段）
    caches: caches,

    // 模板根目录。如果 filename 字段不是本地路径，则在 root 查找模板
    root: '/',

    // 默认后缀名。如果没有后缀名，则会自动添加 extname
    extname: '.art',

    // 忽略的变量。被模板编译器忽略的模板变量列表
    ignore: [],

    // 导入的模板变量
    imports: runtime
};

function Defaults() {
    this.$extend = function(options) {
        options = options || {};
        return extend(options, options instanceof Defaults ? options : this);
    };
}
Defaults.prototype = settings;

module.exports = new Defaults();


/***/ }),
/* 3 */
/***/ (function(module, exports) {



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const render = __webpack_require__(5);
const compile = __webpack_require__(0);
const defaults = __webpack_require__(23);

/**
 * 模板引擎
 * @param   {string}            filename 模板名
 * @param   {Object|string}     content  数据或模板内容
 * @return  {string|function}            如果 content 为 string 则编译并缓存模板，否则渲染模板
 */
const template = (filename, content) => {
    return content instanceof Object
        ? render(
              {
                  filename
              },
              content
          )
        : compile({
              filename,
              source: content
          });
};

template.render = render;
template.compile = compile;
template.defaults = defaults;

module.exports = template;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const compile = __webpack_require__(0);

/**
 * 渲染模板
 * @param   {string|Object}     source  模板内容
 * @param   {Object}            data    数据
 * @param   {?Object}           options 选项
 * @return  {string}            渲染好的字符串
 */
const render = (source, data, options) => compile(source, options)(data);

module.exports = render;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const esTokenizer = __webpack_require__(7);
const tplTokenizer = __webpack_require__(9);

/** 传递给模板的数据引用 */
const DATA = `$data`;

/** 外部导入的所有全局变量引用 */
const IMPORTS = `$imports`;

/**  $imports.$escape */
const ESCAPE = `$escape`;

/**  $imports.$each */
const EACH = `$each`;

/** 文本输出函数 */
const PRINT = `print`;

/** 包含子模板函数 */
const INCLUDE = `include`;

/** 继承布局模板函数 */
const EXTEND = `extend`;

/** “模板块”读写函数 */
const BLOCK = `block`;

/** 字符串拼接变量 */
const OUT = `$$out`;

/** 运行时逐行调试记录变量 [line, start, source] */
const LINE = `$$line`;

/** 所有“模板块”变量 */
const BLOCKS = `$$blocks`;

/** 截取模版输出“流”的函数 */
const SLICE = `$$slice`;

/** 继承的布局模板的文件地址变量 */
const FROM = `$$from`;

/** 编译设置变量 */
const OPTIONS = `$$options`;

const has = (object, key) => Object.hasOwnProperty.call(object, key);
const stringify = JSON.stringify;

class Compiler {
    /**
     * 模板编译器
     * @param   {Object}    options
     */
    constructor(options) {
        let source = options.source;
        const minimize = options.minimize;
        const htmlMinifier = options.htmlMinifier;

        // 编译选项
        this.options = options;

        // 所有语句堆栈
        this.stacks = [];

        // 运行时注入的上下文
        this.context = [];

        // 模板语句编译后的代码
        this.scripts = [];

        // context map
        this.CONTEXT_MAP = {};

        // 忽略的变量名单
        this.ignore = [DATA, IMPORTS, OPTIONS, ...options.ignore];

        // 按需编译到模板渲染函数的内置变量
        this.internal = {
            [OUT]: `''`,
            [LINE]: `[0,0]`,
            [BLOCKS]: `arguments[1]||{}`,
            [FROM]: `null`,
            [PRINT]: `function(){var s=''.concat.apply('',arguments);${OUT}+=s;return s}`,
            [INCLUDE]: `function(src,data){var s=${OPTIONS}.include(src,data||${DATA},arguments[2]||${BLOCKS},${OPTIONS});${OUT}+=s;return s}`,
            [EXTEND]: `function(from){${FROM}=from}`,
            [SLICE]: `function(c,p,s){p=${OUT};${OUT}='';c();s=${OUT};${OUT}=p+s;return s}`,
            [BLOCK]: `function(){var a=arguments,s;if(typeof a[0]==='function'){return ${SLICE}(a[0])}else if(${FROM}){if(!${BLOCKS}[a[0]]){${BLOCKS}[a[0]]=${SLICE}(a[1])}else{${OUT}+=${BLOCKS}[a[0]]}}else{s=${BLOCKS}[a[0]];if(typeof s==='string'){${OUT}+=s}else{s=${SLICE}(a[1])}return s}}`
        };

        // 内置函数依赖关系声明
        this.dependencies = {
            [PRINT]: [OUT],
            [INCLUDE]: [OUT, OPTIONS, DATA, BLOCKS],
            [EXTEND]: [FROM, /*[*/ INCLUDE /*]*/],
            [BLOCK]: [SLICE, FROM, OUT, BLOCKS]
        };

        this.importContext(OUT);

        if (options.compileDebug) {
            this.importContext(LINE);
        }

        if (minimize) {
            try {
                source = htmlMinifier(source, options);
            } catch (error) {}
        }

        this.source = source;
        this.getTplTokens(source, options.rules, this).forEach(tokens => {
            if (tokens.type === tplTokenizer.TYPE_STRING) {
                this.parseString(tokens);
            } else {
                this.parseExpression(tokens);
            }
        });
    }

    /**
     * 将模板代码转换成 tplToken 数组
     * @param   {string} source
     * @return  {Object[]}
     */
    getTplTokens(...args) {
        return tplTokenizer(...args);
    }

    /**
     * 将模板表达式转换成 esToken 数组
     * @param   {string} source
     * @return  {Object[]}
     */
    getEsTokens(source) {
        return esTokenizer(source);
    }

    /**
     * 获取变量列表
     * @param {Object[]} esTokens
     * @return {string[]}
     */
    getVariables(esTokens) {
        let ignore = false;
        return esTokens
            .filter(esToken => {
                return esToken.type !== `whitespace` && esToken.type !== `comment`;
            })
            .filter(esToken => {
                if (esToken.type === `name` && !ignore) {
                    return true;
                }

                ignore = esToken.type === `punctuator` && esToken.value === `.`;

                return false;
            })
            .map(tooken => tooken.value);
    }

    /**
     * 导入模板上下文
     * @param {string} name
     */
    importContext(name) {
        let value = ``;
        const internal = this.internal;
        const dependencies = this.dependencies;
        const ignore = this.ignore;
        const context = this.context;
        const options = this.options;
        const imports = options.imports;
        const contextMap = this.CONTEXT_MAP;

        if (!has(contextMap, name) && ignore.indexOf(name) === -1) {
            if (has(internal, name)) {
                value = internal[name];

                if (has(dependencies, name)) {
                    dependencies[name].forEach(name => this.importContext(name));
                }

                // imports 继承了 Global，但是继承的属性不分配到顶级变量中，避免占用了模板内部的变量名称
            } else if (name === ESCAPE || name === EACH || has(imports, name)) {
                value = `${IMPORTS}.${name}`;
            } else {
                value = `${DATA}.${name}`;
            }

            contextMap[name] = value;
            context.push({
                name,
                value
            });
        }
    }

    /**
     * 解析字符串（HTML）直接输出语句
     * @param {Object} tplToken
     */
    parseString(tplToken) {
        let source = tplToken.value;

        if (!source) {
            return;
        }

        const code = `${OUT}+=${stringify(source)}`;
        this.scripts.push({
            source,
            tplToken,
            code
        });
    }

    /**
     * 解析逻辑表达式语句
     * @param {Object} tplToken
     */
    parseExpression(tplToken) {
        const source = tplToken.value;
        const script = tplToken.script;
        const output = script.output;
        const escape = this.options.escape;
        let code = script.code;

        if (output) {
            if (escape === false || output === tplTokenizer.TYPE_RAW) {
                code = `${OUT}+=${script.code}`;
            } else {
                code = `${OUT}+=${ESCAPE}(${script.code})`;
            }
        }

        const esToken = this.getEsTokens(code);
        this.getVariables(esToken).forEach(name => this.importContext(name));

        this.scripts.push({
            source,
            tplToken,
            code
        });
    }

    /**
     * 检查解析后的模板语句是否存在语法错误
     * @param  {string} script
     * @return {boolean}
     */
    checkExpression(script) {
        // 没有闭合的块级模板语句规则
        // 基于正则规则来补全语法不能保证 100% 准确，
        // 但是在绝大多数情况下足以满足辅助开发调试的需要
        const rules = [
            // <% } %>
            // <% }else{ %>
            // <% }else if(a){ %>
            [/^\s*}[\w\W]*?{?[\s;]*$/, ''],

            // <% fn(c,function(a,b){ %>
            // <% fn(c, a=>{ %>
            // <% fn(c,(a,b)=>{ %>
            [/(^[\w\W]*?\([\w\W]*?(?:=>|\([\w\W]*?\))\s*{[\s;]*$)/, '$1})'],

            // <% if(a){ %>
            // <% for(var i in d){ %>
            [/(^[\w\W]*?\([\w\W]*?\)\s*{[\s;]*$)/, '$1}']
        ];

        let index = 0;
        while (index < rules.length) {
            if (rules[index][0].test(script)) {
                script = script.replace(...rules[index]);
                break;
            }
            index++;
        }

        try {
            new Function(script);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 编译
     * @return  {function}
     */
    build() {
        const options = this.options;
        const context = this.context;
        const scripts = this.scripts;
        const stacks = this.stacks;
        const source = this.source;
        const filename = options.filename;
        const imports = options.imports;
        const mappings = [];
        const extendMode = has(this.CONTEXT_MAP, EXTEND);

        let offsetLine = 0;

        // Create SourceMap: mapping
        const mapping = (code, { line, start }) => {
            const node = {
                generated: {
                    line: stacks.length + offsetLine + 1,
                    column: 1
                },
                original: {
                    line: line + 1,
                    column: start + 1
                }
            };

            offsetLine += code.split(/\n/).length - 1;
            return node;
        };

        // Trim code
        const trim = code => {
            return code.replace(/^[\t ]+|[\t ]$/g, '');
        };

        stacks.push(`function(${DATA}){`);
        stacks.push(`'use strict'`);
        stacks.push(`${DATA}=${DATA}||{}`);
        stacks.push(`var ` + context.map(({ name, value }) => `${name}=${value}`).join(`,`));

        if (options.compileDebug) {
            stacks.push(`try{`);

            scripts.forEach(script => {
                if (script.tplToken.type === tplTokenizer.TYPE_EXPRESSION) {
                    stacks.push(
                        `${LINE}=[${[script.tplToken.line, script.tplToken.start].join(',')}]`
                    );
                }

                mappings.push(mapping(script.code, script.tplToken));
                stacks.push(trim(script.code));
            });

            stacks.push(`}catch(error){`);

            stacks.push(
                'throw {' +
                    [
                        `name:'RuntimeError'`,
                        `path:${stringify(filename)}`,
                        `message:error.message`,
                        `line:${LINE}[0]+1`,
                        `column:${LINE}[1]+1`,
                        `source:${stringify(source)}`,
                        `stack:error.stack`
                    ].join(`,`) +
                    '}'
            );

            stacks.push(`}`);
        } else {
            scripts.forEach(script => {
                mappings.push(mapping(script.code, script.tplToken));
                stacks.push(trim(script.code));
            });
        }

        if (extendMode) {
            stacks.push(`${OUT}=''`);
            stacks.push(`${INCLUDE}(${FROM},${DATA},${BLOCKS})`);
        }

        stacks.push(`return ${OUT}`);
        stacks.push(`}`);

        const renderCode = stacks.join(`\n`);

        try {
            const result = new Function(IMPORTS, OPTIONS, `return ${renderCode}`)(imports, options);
            result.mappings = mappings;
            result.sourcesContent = [source];
            return result;
        } catch (error) {
            let index = 0;
            let line = 0;
            let start = 0;
            let generated;

            while (index < scripts.length) {
                const current = scripts[index];
                if (!this.checkExpression(current.code)) {
                    line = current.tplToken.line;
                    start = current.tplToken.start;
                    generated = current.code;
                    break;
                }
                index++;
            }

            throw {
                name: `CompileError`,
                path: filename,
                message: error.message,
                line: line + 1,
                column: start + 1,
                source,
                generated,
                stack: error.stack
            };
        }
    }
}

/**
 * 模板内置常量
 */
Compiler.CONSTS = {
    DATA,
    IMPORTS,
    PRINT,
    INCLUDE,
    EXTEND,
    BLOCK,
    OPTIONS,
    OUT,
    LINE,
    BLOCKS,
    SLICE,
    FROM,
    ESCAPE,
    EACH
};

module.exports = Compiler;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const isKeyword = __webpack_require__(8);
const jsTokens = __webpack_require__(1).default;
const matchToToken = __webpack_require__(1).matchToToken;

/**
 * 将逻辑表达式解释为 Tokens
 * @param {string} code
 * @return {Object[]}
 */
const esTokenizer = code => {
    const tokens = code
        .match(jsTokens)
        .map(value => {
            jsTokens.lastIndex = 0;
            return matchToToken(jsTokens.exec(value));
        })
        .map(token => {
            if (token.type === 'name' && isKeyword(token.value)) {
                token.type = 'keyword';
            }
            return token;
        });

    return tokens;
};

module.exports = esTokenizer;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// List extracted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords
var reservedKeywords = {
    'abstract': true,
    'await': true,
    'boolean': true,
    'break': true,
    'byte': true,
    'case': true,
    'catch': true,
    'char': true,
    'class': true,
    'const': true,
    'continue': true,
    'debugger': true,
    'default': true,
    'delete': true,
    'do': true,
    'double': true,
    'else': true,
    'enum': true,
    'export': true,
    'extends': true,
    'false': true,
    'final': true,
    'finally': true,
    'float': true,
    'for': true,
    'function': true,
    'goto': true,
    'if': true,
    'implements': true,
    'import': true,
    'in': true,
    'instanceof': true,
    'int': true,
    'interface': true,
    'let': true,
    'long': true,
    'native': true,
    'new': true,
    'null': true,
    'package': true,
    'private': true,
    'protected': true,
    'public': true,
    'return': true,
    'short': true,
    'static': true,
    'super': true,
    'switch': true,
    'synchronized': true,
    'this': true,
    'throw': true,
    'transient': true,
    'true': true,
    'try': true,
    'typeof': true,
    'var': true,
    'void': true,
    'volatile': true,
    'while': true,
    'with': true,
    'yield': true
};

module.exports = function(str) {
    return reservedKeywords.hasOwnProperty(str);
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

const TYPE_STRING = 'string';
const TYPE_EXPRESSION = 'expression';
const TYPE_RAW = 'raw';
const TYPE_ESCAPE = 'escape';

function wrapString(token) {
    const value = new String(token.value);
    value.line = token.line;
    value.start = token.start;
    value.end = token.end;
    return value;
}

function Token(type, value, prevToken) {
    this.type = type;
    this.value = value;
    this.script = null;

    if (prevToken) {
        this.line = prevToken.line + prevToken.value.split(/\n/).length - 1;
        if (this.line === prevToken.line) {
            this.start = prevToken.end;
        } else {
            this.start = prevToken.value.length - prevToken.value.lastIndexOf('\n') - 1;
        }
    } else {
        this.line = 0;
        this.start = 0;
    }

    this.end = this.start + this.value.length;
}

/**
 * 将模板转换为 Tokens
 * @param {string}      source
 * @param {Object[]}    rules     @see defaults.rules
 * @param {Object}      context
 * @return {Object[]}
 */
const tplTokenizer = (source, rules, context = {}) => {
    const tokens = [new Token(TYPE_STRING, source)];

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const flags = rule.test.ignoreCase ? `ig` : `g`;
        const regexp = new RegExp(rule.test.source, flags);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let prevToken = tokens[i - 1];

            if (token.type !== TYPE_STRING) {
                continue;
            }

            let match,
                index = 0;
            const substitute = [];
            const value = token.value;

            while ((match = regexp.exec(value)) !== null) {
                if (match.index > index) {
                    prevToken = new Token(TYPE_STRING, value.slice(index, match.index), prevToken);
                    substitute.push(prevToken);
                }

                prevToken = new Token(TYPE_EXPRESSION, match[0], prevToken);
                match[0] = wrapString(prevToken);
                prevToken.script = rule.use.apply(context, match);
                substitute.push(prevToken);

                index = match.index + match[0].length;
            }

            if (index < value.length) {
                prevToken = new Token(TYPE_STRING, value.slice(index), prevToken);
                substitute.push(prevToken);
            }

            tokens.splice(i, 1, ...substitute);
            i += substitute.length - 1;
        }
    }

    return tokens;
};

tplTokenizer.TYPE_STRING = TYPE_STRING;
tplTokenizer.TYPE_EXPRESSION = TYPE_EXPRESSION;
tplTokenizer.TYPE_RAW = TYPE_RAW;
tplTokenizer.TYPE_ESCAPE = TYPE_ESCAPE;

module.exports = tplTokenizer;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*! art-template@runtime | https://github.com/aui/art-template */

const detectNode = typeof window === 'undefined';
const runtime = Object.create(detectNode ? global : window);
const ESCAPE_REG = /["&'<>]/;

/**
 * 编码模板输出的内容
 * @param  {any}        content
 * @return {string}
 */
runtime.$escape = content => xmlEscape(toString(content));

/**
 * 迭代器，支持数组与对象
 * @param {array|Object} data
 * @param {function}     callback
 */
runtime.$each = (data, callback) => {
    if (Array.isArray(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
            callback(data[i], i);
        }
    } else {
        for (let i in data) {
            callback(data[i], i);
        }
    }
};

// 将目标转成字符
function toString(value) {
    if (typeof value !== 'string') {
        if (value === undefined || value === null) {
            value = '';
        } else if (typeof value === 'function') {
            value = toString(value.call(value));
        } else {
            value = JSON.stringify(value);
        }
    }

    return value;
}

// 编码 HTML 内容
function xmlEscape(content) {
    const html = '' + content;
    const regexResult = ESCAPE_REG.exec(html);
    if (!regexResult) {
        return content;
    }

    let result = '';
    let i, lastIndex, char;
    for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
        switch (html.charCodeAt(i)) {
            case 34:
                char = '&#34;';
                break;
            case 38:
                char = '&#38;';
                break;
            case 39:
                char = '&#39;';
                break;
            case 60:
                char = '&#60;';
                break;
            case 62:
                char = '&#62;';
                break;
            default:
                continue;
        }

        if (lastIndex !== i) {
            result += html.substring(lastIndex, i);
        }

        lastIndex = i + 1;
        result += char;
    }

    if (lastIndex !== i) {
        return result + html.substring(lastIndex, i);
    } else {
        return result;
    }
}

module.exports = runtime;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

const toString = Object.prototype.toString;
const toType = value => {
    // Null: 兼容 IE8
    return value === null ? 'Null' : toString.call(value).slice(8, -1);
};

/**
 * 快速继承默认配置
 * @param   {Object}    options
 * @param   {?Object}   defaults
 * @return  {Object}
 */
const extend = function(target, defaults) {
    let object;
    const type = toType(target);

    if (type === 'Object') {
        object = Object.create(defaults || {});
    } else if (type === 'Array') {
        object = [].concat(defaults || []);
    }

    if (object) {
        for (let index in target) {
            if (Object.hasOwnProperty.call(target, index)) {
                object[index] = extend(target[index], object[index]);
            }
        }
        return object;
    } else {
        return target;
    }
};

module.exports = extend;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 载入子模板
 * @param   {string}    filename
 * @param   {Object}    data
 * @param   {Object}    blocks
 * @param   {Object}    options
 * @return  {string}
 */
const include = (filename, data, blocks, options) => {
    const compile = __webpack_require__(0);
    options = options.$extend({
        filename: options.resolveFilename(filename, options),
        bail: true,
        source: null
    });
    return compile(options)(data, blocks);
};

module.exports = include;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * 调试器
 * @param   {Object}    error
 * @param   {?Object}   options
 * @return  {string}
 */
const onerror = (error /*, options*/) => {
    console.error(error.name, error.message);
};

module.exports = onerror;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

const caches = {
    __data: Object.create(null),

    set: function(key, val) {
        this.__data[key] = val;
    },

    get: function(key) {
        return this.__data[key];
    },

    reset: function() {
        this.__data = {};
    }
};

module.exports = caches;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const detectNode = typeof window === 'undefined';

/**
 * 读取模板内容（同步方法）
 * @param   {string}    filename   模板名
 * @param   {?Object}   options
 * @return  {string}
 */
const loader = (filename /*, options*/) => {
    /* istanbul ignore else  */
    if (detectNode) {
        const fs = __webpack_require__(3);
        return fs.readFileSync(filename, 'utf8');
    } else {
        const elem = document.getElementById(filename);
        return elem.value || elem.innerHTML;
    }
};

module.exports = loader;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * 简洁模板语法规则
 */
const artRule = {
    test: /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/,
    use: function(match, raw, close, code) {
        const compiler = this;
        const options = compiler.options;
        const esTokens = compiler.getEsTokens(code);
        const values = esTokens.map(token => token.value);
        const result = {};

        let group;
        let output = raw ? 'raw' : false;
        let key = close + values.shift();

        // 旧版语法升级提示
        const warn = (oldSyntax, newSyntax) => {
            console.warn(
                `${options.filename || 'anonymous'}:${match.line + 1}:${match.start + 1}\n` +
                    `Template upgrade: {{${oldSyntax}}} -> {{${newSyntax}}}`
            );
        };

        // v3 compat: #value
        if (raw === '#') {
            warn('#value', '@value');
        }

        switch (key) {
            case 'set':
                code = `var ${values.join('').trim()}`;
                break;

            case 'if':
                code = `if(${values.join('').trim()}){`;

                break;

            case 'else':
                const indexIf = values.indexOf('if');

                if (~indexIf) {
                    values.splice(0, indexIf + 1);
                    code = `}else if(${values.join('').trim()}){`;
                } else {
                    code = `}else{`;
                }

                break;

            case '/if':
                code = '}';
                break;

            case 'each':
                group = artRule._split(esTokens);
                group.shift();

                if (group[1] === 'as') {
                    // ... v3 compat ...
                    warn('each object as value index', 'each object value index');
                    group.splice(1, 1);
                }

                const object = group[0] || '$data';
                const value = group[1] || '$value';
                const index = group[2] || '$index';

                code = `$each(${object},function(${value},${index}){`;

                break;

            case '/each':
                code = '})';
                break;

            case 'block':
                group = artRule._split(esTokens);
                group.shift();
                code = `block(${group.join(',').trim()},function(){`;
                break;

            case '/block':
                code = '})';
                break;

            case 'echo':
                key = 'print';
                warn('echo value', 'value');
            case 'print':
            case 'include':
            case 'extend':
                if (
                    values
                        .join('')
                        .trim()
                        .indexOf('(') !== 0
                ) {
                    // 执行函数省略 `()` 与 `,`
                    group = artRule._split(esTokens);
                    group.shift();
                    code = `${key}(${group.join(',')})`;
                    break;
                }

            default:
                if (~values.indexOf('|')) {
                    const v3split = ':'; // ... v3 compat ...

                    // 将过滤器解析成二维数组
                    const group = esTokens
                        .reduce((group, token) => {
                            const { value, type } = token;
                            if (value === '|') {
                                group.push([]);
                            } else if (type !== `whitespace` && type !== `comment`) {
                                if (!group.length) {
                                    group.push([]);
                                }
                                if (value === v3split && group[group.length - 1].length === 1) {
                                    warn('value | filter: argv', 'value | filter argv');
                                } else {
                                    group[group.length - 1].push(token);
                                }
                            }
                            return group;
                        }, [])
                        .map(g => artRule._split(g));

                    // 将过滤器管道化
                    code = group.reduce(
                        (accumulator, filter) => {
                            const name = filter.shift();
                            filter.unshift(accumulator);

                            return `$imports.${name}(${filter.join(',')})`;
                        },
                        group
                            .shift()
                            .join(` `)
                            .trim()
                    );
                }

                output = output || 'escape';

                break;
        }

        result.code = code;
        result.output = output;

        return result;
    },

    // 将多个 javascript 表达式拆分成组
    // 支持基本运算、三元表达式、取值、运行函数，不支持 `typeof value` 操作
    // 只支持 string、number、boolean、null、undefined 这几种类型声明，不支持 function、object、array
    _split: esTokens => {
        esTokens = esTokens.filter(({ type }) => {
            return type !== `whitespace` && type !== `comment`;
        });

        let current = 0;
        let lastToken = esTokens.shift();
        const punctuator = `punctuator`;
        const close = /\]|\)/;
        const group = [[lastToken]];

        while (current < esTokens.length) {
            const esToken = esTokens[current];

            if (
                esToken.type === punctuator ||
                (lastToken.type === punctuator && !close.test(lastToken.value))
            ) {
                group[group.length - 1].push(esToken);
            } else {
                group.push([esToken]);
            }

            lastToken = esToken;

            current++;
        }

        return group.map(g => g.map(g => g.value).join(``));
    }
};

module.exports = artRule;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * 原生模板语法规则
 */
const nativeRule = {
    test: /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/,
    use: (match, comment, output, code /*, trimMode*/) => {
        output = {
            '-': 'raw',
            '=': 'escape',
            '': false,
            // v3 compat: raw output
            '==': 'raw',
            '=#': 'raw'
        }[output];

        // ejs compat: comment tag
        if (comment) {
            code = `/*${code}*/`;
            output = false;
        }

        // ejs compat: trims following newline
        // if (trimMode) {}

        return {
            code,
            output
        };
    }
};

module.exports = nativeRule;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const detectNode = typeof window === 'undefined';

/**
 * HTML 压缩器
 * @param  {string}     source
 * @param  {Object}     options
 * @return {string}
 */
const htmlMinifier = (source, options) => {
    if (detectNode) {
        const htmlMinifier = __webpack_require__(20).minify;
        const htmlMinifierOptions = options.htmlMinifierOptions;
        const ignoreCustomFragments = options.rules.map(rule => rule.test);
        htmlMinifierOptions.ignoreCustomFragments.push(...ignoreCustomFragments);
        source = htmlMinifier(source, htmlMinifierOptions);
    }

    return source;
};

module.exports = htmlMinifier;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

(function(exports) {
  exports.noop = function(){};
})(typeof module === 'object' && typeof module.exports === 'object' ? module.exports : window);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const detectNode = typeof window === 'undefined';
const LOCAL_MODULE = /^\.+\//;

/**
 * 获取模板的绝对路径
 * @param   {string} filename
 * @param   {Object} options
 * @return  {string}
 */
const resolveFilename = (filename, options) => {
    /* istanbul ignore else  */
    if (detectNode) {
        const path = __webpack_require__(3);
        const root = options.root;
        const extname = options.extname;

        if (LOCAL_MODULE.test(filename)) {
            const from = options.filename;
            const self = !from || filename === from;
            const base = self ? root : path.dirname(from);
            filename = path.resolve(base, filename);
        } else {
            filename = path.resolve(root, filename);
        }

        if (!path.extname(filename)) {
            filename = filename + extname;
        }
    }

    return filename;
};

module.exports = resolveFilename;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * 模板错误处理类
 * @param   {Object}    options
 */
class TemplateError extends Error {
    constructor(options) {
        super(options.message);
        this.name = 'TemplateError';
        this.message = formatMessage(options);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

function formatMessage({ name, source, path, line, column, generated, message }) {
    if (!source) {
        return message;
    }

    const lines = source.split(/\n/);
    const start = Math.max(line - 3, 0);
    const end = Math.min(lines.length, line + 3);

    // Error context
    const context = lines
        .slice(start, end)
        .map((code, index) => {
            const number = index + start + 1;
            const left = number === line ? ' >> ' : '    ';
            return `${left}${number}| ${code}`;
        })
        .join('\n');

    // Alter exception message
    return (
        `${path || 'anonymous'}:${line}:${column}\n` +
        `${context}\n\n` +
        `${name}: ${message}` +
        (generated ? `\n   generated: ${generated}` : '')
    );
}

module.exports = TemplateError;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
});
//# sourceMappingURL=template-web.js.map