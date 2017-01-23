#include "stream_decode_worker.h"

using namespace v8;

StreamDecodeWorker::StreamDecodeWorker(Nan::Callback *callback, StreamDecode* obj)
  : Nan::AsyncWorker(callback), obj(obj) {}

StreamDecodeWorker::~StreamDecodeWorker() {
}

void StreamDecodeWorker::Execute() {
  Allocator::AllocatedBuffer* buf_info;

  do {
    void* buf = obj->alloc.Alloc(131072);
    if (!buf) {
      res = BROTLI_RESULT_ERROR;
      return;
    }

    uint8_t* next_out = static_cast<uint8_t*>(buf);
    buf_info = Allocator::GetBufferInfo(buf);
    res = BrotliDecompressStream(&obj->available_in,
                                 &obj->next_in,
                                 &buf_info->available,
                                 &next_out,
                                 NULL,
                                 obj->state);

    obj->pending_output.push_back(static_cast<uint8_t*>(buf));
  } while(res == BROTLI_RESULT_NEEDS_MORE_OUTPUT);
}

void StreamDecodeWorker::HandleOKCallback() {
  if (res == BROTLI_RESULT_ERROR || res == BROTLI_RESULT_NEEDS_MORE_OUTPUT) {
    Local<Value> argv[] = {
      Nan::Error("Brotli failed to decompress.")
    };
    callback->Call(1, argv);
  } else {
    Local<Value> argv[] = {
      Nan::Null(),
      obj->PendingChunksAsArray()
    };
    callback->Call(2, argv);
  }

  obj->alloc.ReportMemoryToV8();
}
