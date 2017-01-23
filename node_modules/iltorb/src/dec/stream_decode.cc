#include "stream_decode.h"
#include "stream_decode_worker.h"

using namespace v8;

StreamDecode::StreamDecode() : next_in(NULL), available_in(0) {
  state = BrotliCreateState(Allocator::Alloc, Allocator::Free, &alloc);
  alloc.ReportMemoryToV8();
}

StreamDecode::~StreamDecode() {
  BrotliDestroyState(state);
}

void StreamDecode::Init(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE target) {
  Local<FunctionTemplate> tpl = Nan::New<FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("StreamDecode").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "transform", Transform);
  Nan::SetPrototypeMethod(tpl, "flush", Flush);

  constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
  Nan::Set(target, Nan::New("StreamDecode").ToLocalChecked(),
    Nan::GetFunction(tpl).ToLocalChecked());
}

NAN_METHOD(StreamDecode::New) {
  StreamDecode* obj = new StreamDecode();
  obj->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(StreamDecode::Transform) {
  StreamDecode* obj = ObjectWrap::Unwrap<StreamDecode>(info.Holder());

  Local<Object> buffer = info[0]->ToObject();
  obj->next_in = (const uint8_t*) node::Buffer::Data(buffer);
  obj->available_in = node::Buffer::Length(buffer);

  Nan::Callback *callback = new Nan::Callback(info[1].As<Function>());
  StreamDecodeWorker *worker = new StreamDecodeWorker(callback, obj);
  if (info[2]->BooleanValue()) {
    worker->SaveToPersistent(0U, buffer);
    worker->SaveToPersistent(1U, obj->handle());
    Nan::AsyncQueueWorker(worker);
  } else {
    worker->Execute();
    worker->WorkComplete();
    worker->Destroy();
  }
}

NAN_METHOD(StreamDecode::Flush) {
  StreamDecode* obj = ObjectWrap::Unwrap<StreamDecode>(info.Holder());

  Nan::Callback *callback = new Nan::Callback(info[0].As<Function>());
  StreamDecodeWorker *worker = new StreamDecodeWorker(callback, obj);
  if (info[1]->BooleanValue()) {
    Nan::AsyncQueueWorker(worker);
  } else {
    worker->Execute();
    worker->WorkComplete();
    worker->Destroy();
  }
}

Nan::Persistent<Function> StreamDecode::constructor;
