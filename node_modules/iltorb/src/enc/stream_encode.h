#ifndef STREAM_ENCODE_H
#define STREAM_ENCODE_H

#include <nan.h>
#include "../common/stream_coder.h"
#include "../../brotli/enc/encode.h"

class StreamEncode : public StreamCoder {
  public:
    static void Init(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE target);

    BrotliEncoderState* state;
  private:
    explicit StreamEncode(Local<Object> params);
    ~StreamEncode();

    static NAN_METHOD(New);
    static NAN_METHOD(GetBlockSize);
    static NAN_METHOD(Copy);
    static NAN_METHOD(Encode);
    static Nan::Persistent<v8::Function> constructor;
};

#endif
