import * as fs from "fs";
import { dirname } from "node:path";
import path from "path";
import { InitializeResult, newInitializeRes } from "../src/lsp/initialize";
import { type RequestMsg } from "../src/lsp/message";
import { decodeMsg, encodeMsg } from "../src/rfc";
import { State } from "./analysis/analysis";
import { prepDiagnosisResponse, PublishDiagnosticsParams } from "./lsp/publish";
import {
  CodeActionParams,
  codeActionResponse,
  CodeActionResult,
  completionResponse,
  CompletionResult,
  DefinitionRequestParams,
  definitionResponse,
  DefinitionResult,
  DidChangeTextDocumentParams,
  DidOpenTextDocumentParams,
  HoverRequestParams,
  hoverResponse,
  HoverResult,
} from "./lsp/textdocument";

const state: State = new State();

process.stdin.on("data", (msg) => {
  const reqMsg: RequestMsg = decodeMsg(msg.toString());
  let method: string = reqMsg.method;

  switch (method) {
    case "initialize": {
      const res: InitializeResult = newInitializeRes(reqMsg.id);
      logHere(
        "Server name: " +
          res.result.serverInfo.name +
          "\n" +
          "Server version: " +
          res.result.serverInfo.version +
          "\n",
      );
      process.stdout.write(encodeMsg(res));
      break;
    }

    case "textDocument/didOpen": {
      const params: DidOpenTextDocumentParams = <DidOpenTextDocumentParams>(
        reqMsg.params
      );
      state.saveState(params.textDocument.uri, params.textDocument.text);
      const diagnosticNotification: PublishDiagnosticsParams =
        prepDiagnosisResponse(
          params.textDocument.uri,
          params.textDocument.text,
        );
      if (diagnosticNotification.params.diagnostics.length > 0) {
        process.stdout.write(encodeMsg(diagnosticNotification));
      }
      break;
    }

    case "textDocument/didChange": {
      const params: DidChangeTextDocumentParams = <DidChangeTextDocumentParams>(
        reqMsg.params
      );
      state.saveState(params.textDocument.uri, params.contentChanges[0].text);
      const diagnosticNotification: PublishDiagnosticsParams =
        prepDiagnosisResponse(
          params.textDocument.uri,
          params.contentChanges[0].text,
        );
      if (diagnosticNotification.params.diagnostics.length > 0) {
        process.stdout.write(encodeMsg(diagnosticNotification));
      }
      break;
    }

    case "textDocument/didClose": {
      logHere("Got notification for text document did close. ");
      break;
    }

    case "textDocument/hover": {
      const params: HoverRequestParams = <HoverRequestParams>reqMsg.params;
      const res: HoverResult = hoverResponse(
        reqMsg.id,
        `Total Characters in file: ${state.getStateOfDoc(params.textDocument.uri).length}`,
      );
      process.stdout.write(encodeMsg(res));
      break;
    }

    case "textDocument/definition": {
      const params: DefinitionRequestParams = <DefinitionRequestParams>(
        reqMsg.params
      );
      // In this case, for demonstration, sending the definition to "test-b.txt" file
      // present in the current directory.
      const currDir: string = dirname(
        params.textDocument.uri.replace("file://", ""),
      );
      const targetUri: string = "file://" + path.resolve(currDir, "test-b.txt");
      const res: DefinitionResult = definitionResponse(reqMsg.id, targetUri);
      process.stdout.write(encodeMsg(res));
      break;
    }

    case "textDocument/codeAction": {
      const params: CodeActionParams = <CodeActionParams>reqMsg.params;
      // In this case, for demonstration, replace "sad" with "grateful"
      const res: CodeActionResult = codeActionResponse(
        reqMsg.id,
        params.textDocument.uri,
        state.getStateOfDoc(params.textDocument.uri), // file content.
      );
      process.stdout.write(encodeMsg(res));
      break;
    }

    case "textDocument/completion": {
      const compRes: CompletionResult = completionResponse(reqMsg.id);
      process.stdout.write(encodeMsg(compRes));
      break;
    }
  }

  logHere(msg.toString());
});

export function logHere(msg: string) {
  const logPath = path.join(__dirname, "..", "log.txt");
  try {
    fs.appendFileSync(logPath, msg + "\n", "utf-8");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
