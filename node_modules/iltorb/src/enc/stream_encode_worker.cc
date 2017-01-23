#include "stream_encode_worker.h"

using namespace v8;

StreamEncodeWorker::StreamEncodeWorker(Nan::Callback *callback, StreamEncode* obj, bool is_last)
  : Nan::AsyncWorker(callback), obj(obj), is_last(is_last) {}

StreamEncodeWorker::~StreamEncodeWorker() {
}

void StreamEncodeWorker::Execute() {
  uint8_t* buffer = NULL;
  size_t output_size = 0;
  res = BrotliEncoderWriteData(obj->state, is_last, false, &output_size, &buffer);

  if (output_size > 0) {
    uint8_t* output = static_cast<uint8_t*>(obj->alloc.Alloc(output_size));
    if (!output) {
      res = 0;
      return;
    }

    memcpy(output, buffer, output_size);
    Allocator::AllocatedBuffer* buf_info = Allocator::GetBufferInfo(output);
    buf_info->available = 0;
    obj->pending_output.push_back(output);
  }
}

void StreamEncodeWorker::HandleOKCallback() {
  if (!res) {
    Local<Value> argv[] = {
      Nan::Error("Brotli failed to compress.")
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
