import { LSPAny } from "./types";

export interface RequestMsg {
  jsonrpc: string;
  id: number | string;
  readonly method: string;
  params?: [] | object;
}

export interface ResponseMsg {
  jsonrpc: string;
  id: number | string | null;
}

export interface ResponseError {
  code: number;
  message: string;
  data?: LSPAny;
}

// A processed notification must not send a response.
export interface Notification {
  jsonrpc: string;
  method: string;
  params?: [] | object;
}
