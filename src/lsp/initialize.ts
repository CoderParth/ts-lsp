import { ResponseMsg } from "./message";

export interface InitializeResult extends ResponseMsg {
  result: {
    capabilities: ServerCapabilities;
    serverInfo: {
      name: string;
      version: string;
    };
  };
}

export interface ServerCapabilities {
  textDocumentSync: TextDocumentSyncOptions;
  hoverProvider: boolean;
  definitionProvider: boolean;
  codeActionProvider: boolean;
  completionProvider: {};
}

interface TextDocumentSyncOptions {
  openClose: boolean;
  change: number;
}

export function newInitializeRes(reqId: number | string): InitializeResult {
  const res: InitializeResult = {
    jsonrpc: "2.0",
    id: reqId,
    result: {
      capabilities: {
        textDocumentSync: {
          openClose: true,
          change: 1,
        },
        hoverProvider: true,
        definitionProvider: true,
        codeActionProvider: true,
        completionProvider: {},
      },
      serverInfo: {
        name: "ts-lsp",
        version: "0.0.1",
      },
    },
  };
  return res;
}
