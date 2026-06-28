/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bsatk/index.js":
/*!*************************************!*\
  !*** ./node_modules/bsatk/index.js ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));

let lib = __webpack_require__(/*! ./build/Release/bsatk */ "./build/Release/bsatk");

module.exports = lib;


/***/ }),

/***/ "./node_modules/os-tmpdir/index.js":
/*!*****************************************!*\
  !*** ./node_modules/os-tmpdir/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";

var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
module.exports = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};


/***/ }),

/***/ "./node_modules/tmp/lib/tmp.js":
/*!*************************************!*\
  !*** ./node_modules/tmp/lib/tmp.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * Tmp
 *
 * Copyright (c) 2011-2015 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var
  fs     = __webpack_require__(/*! fs */ "fs"),
  path   = __webpack_require__(/*! path */ "path"),
  crypto = __webpack_require__(/*! crypto */ "crypto"),
  tmpDir = __webpack_require__(/*! os-tmpdir */ "./node_modules/os-tmpdir/index.js"),
  _c     = __webpack_require__(/*! constants */ "constants");


/**
 * The working inner variables.
 */
var
  // store the actual TMP directory
  _TMP = tmpDir(),

  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = _c.O_CREAT | _c.O_EXCL | _c.O_RDWR,

  DIR_MODE = 448 /* 0700 */,
  FILE_MODE = 384 /* 0600 */,

  // this will hold the objects need to be removed on exit
  _removeObjects = [],

  _gracefulCleanup = false,
  _uncaughtException = false;

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {Number} howMany
 * @return {String}
 * @api private
 */
function _randomChars(howMany) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api private
 */
function _parseArguments(options, callback) {
  if (typeof options == 'function') {
    var
      tmp = options;
      options = callback || {};
      callback = tmp;
  } else if (typeof options == 'undefined') {
    options = {};
  }

  return [options, callback];
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {String}
 * @api private
 */
function _generateTmpName(opts) {
  if (opts.name) {
    return path.join(opts.dir || _TMP, opts.name);
  }

  // mkstemps like template
  if (opts.template) {
    return opts.template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  // prefix and postfix
  var name = [
    opts.prefix || 'tmp-',
    process.pid,
    _randomChars(12),
    opts.postfix || ''
  ].join('');

  return path.join(opts.dir || _TMP, name);
}

/**
 * Gets a temporary file name.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api private
 */
function _getTmpName(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1],
    tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  (function _getUniqueName() {
    var name = _generateTmpName(opts);

    // check whether the path exists then retry if needed
    fs.stat(name, function (err) {
      if (!err) {
        if (tries-- > 0) return _getUniqueName();

        return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
      }

      cb(null, name);
    });
  }());
}

/**
 * Synchronous version of _getTmpName.
 *
 * @param {Object} options
 * @returns {String}
 * @api private
 */
function _getTmpNameSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0],
    tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    throw new Error('Invalid tries');

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    throw new Error('Invalid template provided');

  do {
    var name = _generateTmpName(opts);
    try {
        fs.statSync(name);
    } catch (e) {
        return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */
function _createTmpFile(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

    opts.postfix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets a temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      if (err) return cb(err);

      cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
    });
  });
}

/**
 * Synchronous version of _createTmpFile.
 *
 * @param {Object} options
 * @returns {Object} object consists of name, fd and removeCallback
 * @api private
 */
function _createTmpFileSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

    opts.postfix = opts.postfix || '.tmp';

  var name = _getTmpNameSync(opts);
  var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);

  return {
    name : name,
    fd : fd,
    removeCallback : _prepareTmpFileRemoveCallback(name, fd, opts)
  };
}

/**
 * Removes files and folders in a directory recursively.
 *
 * @param {String} root
 * @api private
 */
function _rmdirRecursiveSync(root) {
  var dirs = [root];

  do {
    var
      dir = dirs.pop(),
      deferred = false,
      files = fs.readdirSync(dir);

    for (var i = 0, length = files.length; i < length; i++) {
      var
        file = path.join(dir, files[i]),
        stat = fs.lstatSync(file); // lstat so we don't recurse into symlinked directories

      if (stat.isDirectory()) {
        if (!deferred) {
          deferred = true;
          dirs.push(dir);
        }  
        dirs.push(file);
      } else {
        fs.unlinkSync(file);
      }
    }

    if (!deferred) {
      fs.rmdirSync(dir);
    }
  } while (dirs.length !== 0);
}

/**
 * Creates a temporary directory.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */
function _createTmpDir(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      if (err) return cb(err);

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
    });
  });
}

/**
 * Synchronous version of _createTmpDir.
 *
 * @param {Object} options
 * @returns {Object} object consists of name and removeCallback
 * @api private
 */
function _createTmpDirSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  var name = _getTmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name : name,
    removeCallback : _prepareTmpDirRemoveCallback(name, opts)
  };
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * @param {String} name
 * @param {int} fd
 * @param {Object} opts
 * @api private
 * @returns {Function} the callback
 */
function _prepareTmpFileRemoveCallback(name, fd, opts) {
  var removeCallback = _prepareRemoveCallback(function _removeCallback(fdPath) {
    try {
      fs.closeSync(fdPath[0]);
    }
    catch (e) {
      // under some node/windows related circumstances, a temporary file 
      // may have not be created as expected or the file was already closed
      // by the user, in which case we will simply ignore the error
      if (e.errno != -_c.EBADF && e.errno != -_c.ENOENT) {
        // reraise any unanticipated error
        throw e;
      }
    }
    fs.unlinkSync(fdPath[1]);
  }, [fd, name]);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * @param {String} name
 * @param {Object} opts
 * @returns {Function} the callback
 * @api private
 */
function _prepareTmpDirRemoveCallback(name, opts) {
  var removeFunction = opts.unsafeCleanup ? _rmdirRecursiveSync : fs.rmdirSync.bind(fs);
  var removeCallback = _prepareRemoveCallback(removeFunction, name);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * @param {Function} removeFunction
 * @param {Object} arg
 * @returns {Function}
 * @api private
 */
function _prepareRemoveCallback(removeFunction, arg) {
  var called = false;

  return function _cleanupCallback() {
    if (called) return;

    var index = _removeObjects.indexOf(_cleanupCallback);
    if (index >= 0) {
      _removeObjects.splice(index, 1);
    }

    called = true;
    removeFunction(arg);
  };
}

/**
 * The garbage collector.
 *
 * @api private
 */
function _garbageCollector() {
  if (_uncaughtException && !_gracefulCleanup) {
    return;
  }

  for (var i = 0, length = _removeObjects.length; i < length; i++) {
    try {
      _removeObjects[i].call(null);
    } catch (e) {
      // already removed?
    }
  }
}

function _setGracefulCleanup() {
  _gracefulCleanup = true;
}

var version = process.versions.node.split('.').map(function (value) {
  return parseInt(value, 10);
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown(err) {
    _uncaughtException = true;
    _garbageCollector();

    throw err;
  });
}

process.addListener('exit', function _exit(code) {
  if (code) _uncaughtException = true;
  _garbageCollector();
});

// exporting all the needed methods
module.exports.tmpdir = _TMP;
module.exports.dir = _createTmpDir;
module.exports.dirSync = _createTmpDirSync;
module.exports.file = _createTmpFile;
module.exports.fileSync = _createTmpFileSync;
module.exports.tmpName = _getTmpName;
module.exports.tmpNameSync = _getTmpNameSync;
module.exports.setGracefulCleanup = _setGracefulCleanup;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const bluebird_1 = __importDefault(__webpack_require__(/*! bluebird */ "bluebird"));
const bsatk_1 = __webpack_require__(/*! bsatk */ "./node_modules/bsatk/index.js");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const stream_1 = __webpack_require__(/*! stream */ "stream");
const tmp_1 = __webpack_require__(/*! tmp */ "./node_modules/tmp/lib/tmp.js");
const vortex_api_1 = __webpack_require__(/*! vortex-api */ "vortex-api");
class BSAHandler {
    constructor(bsa) {
        this.mBSA = bsa;
    }
    readDir(archPath) {
        return bluebird_1.default.resolve(this.readDirImpl(this.mBSA.root, archPath.split(path.sep), 0));
    }
    extractFile(filePath, outputPath) {
        const file = this.getFileImpl(this.mBSA.root, filePath.split(path.sep), 0);
        if (file === undefined) {
            return bluebird_1.default.reject(new Error('file not found ' + filePath));
        }
        return new bluebird_1.default((resolve, reject) => {
            this.mBSA.extractFile(file, outputPath, (readErr) => {
                if (readErr !== null) {
                    reject(readErr);
                }
                resolve();
            });
        });
    }
    extractAll(outputPath) {
        return new bluebird_1.default((resolve, reject) => {
            this.mBSA.extractAll(outputPath, (readErr) => {
                if (readErr !== null) {
                    reject(readErr);
                }
                resolve();
            });
        });
    }
    readFile(filePath) {
        const pass = new stream_1.PassThrough();
        const file = this.getFileImpl(this.mBSA.root, filePath.split(path.sep), 0);
        if (file === undefined) {
            pass.emit('error', new Error('file not found ' + filePath));
            return pass;
        }
        (0, tmp_1.dir)((tmpErr, tmpPath, cleanup) => {
            if (tmpErr !== null) {
                return pass.emit('error', tmpErr);
            }
            this.mBSA.extractFile(file, tmpPath, (readErr) => {
                if (readErr !== null) {
                    return pass.emit('error', readErr);
                }
                const fileStream = vortex_api_1.fs.createReadStream(path.join(tmpPath, path.basename(filePath)));
                fileStream.on('data', (data) => pass.write(data));
                fileStream.on('end', () => {
                    pass.end();
                    vortex_api_1.fs.removeAsync(tmpPath).catch(() => null);
                });
                fileStream.on('error', (err) => pass.emit('error', err));
                fileStream.on('readable', () => pass.emit('readable'));
            });
        });
        return pass;
    }
    addFile(filePath, sourcePath) {
        const segments = filePath.split(path.sep);
        let current = this.mBSA.root;
        segments.forEach((segment, idx) => {
            if (idx === segments.length - 1) {
                current.addFile(this.mBSA.createFile(segment, sourcePath, false));
            }
            else {
                current = this.getSubfolder(current, segment);
            }
        });
        return bluebird_1.default.resolve();
    }
    write() {
        this.mBSA.write();
        return bluebird_1.default.resolve();
    }
    closeArchive() {
        this.mBSA.closeArchive();
        return bluebird_1.default.resolve();
    }
    getSubfolder(base, name) {
        for (let i = 0; i < base.numSubFolders; ++i) {
            if (base.getSubFolder(i).name.toLowerCase() === name.toLowerCase()) {
                return base.getSubFolder(i);
            }
        }
        return base.addFolder(name);
    }
    getFileImpl(folder, filePath, offset) {
        if (offset === filePath.length - 1) {
            return this.getFiles(folder).find(file => file.name === filePath[offset]);
        }
        const res = this.findSubFolders(folder, filePath[offset]).map((subFolder) => this.getFileImpl(subFolder, filePath, offset + 1));
        return res.find(item => item !== undefined);
    }
    readDirImpl(folder, archPath, offset) {
        if (offset === archPath.length) {
            return this.getFileAndFolderNames(folder);
        }
        const res = this.findSubFolders(folder, archPath[offset]).map((subFolder) => this.readDirImpl(subFolder, archPath, offset + 1));
        return [].concat.apply([], res);
    }
    findSubFolders(folder, name) {
        const res = [];
        for (let idx = 0; idx < folder.numSubFolders; ++idx) {
            const iter = folder.getSubFolder(idx);
            if (iter.name === name) {
                res.push(iter);
            }
        }
        return res;
    }
    getFileAndFolderNames(folder) {
        return [].concat(this.getFolders(folder).map(item => item.name), this.getFiles(folder).map(item => item.name));
    }
    getFolders(parent) {
        const res = [];
        for (let idx = 0; idx < parent.numSubFolders; ++idx) {
            res.push(parent.getSubFolder(idx));
        }
        return res;
    }
    getFiles(parent) {
        const res = [];
        for (let idx = 0; idx < parent.numFiles; ++idx) {
            res.push(parent.getFile(idx));
        }
        return res;
    }
}
function createBSAHandler(fileName, options) {
    return bluebird_1.default.resolve((() => __awaiter(this, void 0, void 0, function* () {
        return (options.create)
            ? vortex_api_1.util.toPromise(cb => (0, bsatk_1.createBSA)(fileName, cb))
            : vortex_api_1.util.toPromise(cb => (0, bsatk_1.loadBSA)(fileName, options.verify === true, cb));
    }))())
        .then((arc) => Promise.resolve(new BSAHandler(arc)));
}
function init(context) {
    context.registerArchiveType('bsa', createBSAHandler);
    return true;
}
exports["default"] = init;


/***/ }),

/***/ "./build/Release/bsatk":
/*!**************************!*\
  !*** external "./bsatk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("./bsatk");

/***/ }),

/***/ "bluebird":
/*!***************************!*\
  !*** external "bluebird" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("bluebird");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "vortex-api":
/*!*****************************!*\
  !*** external "vortex-api" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("vortex-api");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundledPlugins/gamebryo-bsa-support/gamebryo-bsa-support.js.map