'use strict';

exports.compress = compress;
exports.decompress = decompress;
exports.compressSync = compressSync;
exports.decompressSync = decompressSync;
exports.compressStream = compressStream;
exports.decompressStream = decompressStream;

var encode = require('./build/Release/encode.node');
var decode = require('./build/Release/decode.node');
var Transform = require('stream').Transform;
var util = require('util');

function compress(input, params, cb) {
  if (arguments.length === 2) {
    cb = params;
    params = {};
  }
  if (!Buffer.isBuffer(input)) {
    process.nextTick(cb, new Error('Brotli input is not a buffer.'));
    return;
  }
  if (typeof cb !== 'function') {
    process.nextTick(cb, new Error('Second argument is not a function.'));
    return;
  }
  var stream = new TransformStreamEncode(params);
  var chunks = [];
  var length = 0;
  stream.on('error', cb);
  stream.on('data', function(c) { chunks.push(c); length += c.length; });
  stream.on('end', function() { cb(null, Buffer.concat(chunks, length)); });
  stream.end(input);
}

function decompress(input, cb) {
  if (!Buffer.isBuffer(input)) {
    process.nextTick(cb, new Error('Brotli input is not a buffer.'));
    return;
  }
  if (typeof cb !== 'function') {
    process.nextTick(cb, new Error('Second argument is not a function.'));
    return;
  }
  var stream = new TransformStreamDecode();
  var chunks = [];
  var length = 0;
  stream.on('error', cb);
  stream.on('data', function(c) { chunks.push(c); length += c.length; });
  stream.on('end', function() { cb(null, Buffer.concat(chunks, length)); });
  stream.end(input);
}

function compressSync(input, params) {
  if (!Buffer.isBuffer(input)) {
    throw new Error('Brotli input is not a buffer.');
  }
  var stream = new TransformStreamEncode(params, true);
  var chunks = [];
  var length = 0;
  stream.on('error', function(e) { throw e; });
  stream.on('data', function(c) { chunks.push(c); length += c.length; });
  stream.end(input);
  return Buffer.concat(chunks, length);
}

function decompressSync(input) {
  if (!Buffer.isBuffer(input)) {
    throw new Error('Brotli input is not a buffer.');
  }
  var stream = new TransformStreamDecode({}, true);
  var chunks = [];
  var length = 0;
  stream.on('error', function(e) { throw e; });
  stream.on('data', function(c) { chunks.push(c); length += c.length; });
  stream.end(input);
  return Buffer.concat(chunks, length);
}

function TransformStreamEncode(params, sync) {
  Transform.call(this, params);

  this.encoder = new encode.StreamEncode(params || {});
  this.sync = sync || false;
  var blockSize = this.encoder.getBlockSize();
  this.status = {
    blockSize: blockSize,
    remaining: blockSize
  };
}
util.inherits(TransformStreamEncode, Transform);

TransformStreamEncode.prototype._transform = function(chunk, encoding, next) {
  compressStreamChunk(this, chunk, this.encoder, this.status, this.sync, next);
};

TransformStreamEncode.prototype._flush = function(done) {
  var that = this;
  this.encoder.encode(true, function(err, output) {
    if (err) {
      return done(err);
    }
    if (output) {
      for (var i = 0; i < output.length; i++) {
        that.push(output[i]);
      }
    }
    done();
  }, !this.sync);
};

// We need to fill the blockSize for better compression results
function compressStreamChunk(stream, chunk, encoder, status, sync, done) {
  var length = chunk.length;

  if (length > status.remaining) {
    var slicedChunk = chunk.slice(0, status.remaining);
    chunk = chunk.slice(status.remaining);
    status.remaining = status.blockSize;

    encoder.copy(slicedChunk);
    encoder.encode(false, function(err, output) {
      if (err) {
        return done(err);
      }
      if (output) {
        for (var i = 0; i < output.length; i++) {
          stream.push(output[i]);
        }
      }
      compressStreamChunk(stream, chunk, encoder, status, sync, done);
    }, !sync);
  } else if (length < status.remaining) {
    status.remaining -= length;
    encoder.copy(chunk);
    done();
  } else { // length === status.remaining
    status.remaining = status.blockSize;
    encoder.copy(chunk);
    encoder.encode(false, function(err, output) {
      if (err) {
        return done(err);
      }
      if (output) {
        for (var i = 0; i < output.length; i++) {
          stream.push(output[i]);
        }
      }
      done();
    }, !sync);
  }
}

function compressStream(params) {
  return new TransformStreamEncode(params);
}

function TransformStreamDecode(params, sync) {
  Transform.call(this, params);

  this.sync = sync || false;
  this.decoder = new decode.StreamDecode();
}
util.inherits(TransformStreamDecode, Transform);

TransformStreamDecode.prototype._transform = function(chunk, encoding, next) {
  var that = this;
  this.decoder.transform(chunk, function(err, output) {
    if (err) {
      return next(err);
    }
    if (output) {
      for (var i = 0; i < output.length; i++) {
        that.push(output[i]);
      }
    }
    next();
  }, !this.sync);
};

TransformStreamDecode.prototype._flush = function(done) {
  var that = this;
  this.decoder.flush(function(err, output) {
    if (err) {
      return done(err);
    }
    if (output) {
      for (var i = 0; i < output.length; i++) {
        that.push(output[i]);
      }
    }
    done();
  }, !this.sync);
};

function decompressStream(params) {
  return new TransformStreamDecode(params);
}
