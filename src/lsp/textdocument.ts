import { ResponseMsg } from "./message";

/**
 * textDocument/didOpen
 */
export interface TextDocumentItem {
  uri: string;
  languageId: string;
  version: number;
  text: string;
}

export interface DidOpenTextDocumentParams {
  textDocument: TextDocumentItem;
}

/**
 * textDocument/didChange
 */
export interface DidChangeTextDocumentParams {
  textDocument: {
    version: number;
    uri: string;
  };
  contentChanges: TextDocumentContentChangeEvent[];
}

export interface TextDocumentContentChangeEvent {
  range: Range;
  text: string; // the new text for the provided range.
}

/**
 * textDocument/hover -- Request
 */
export interface HoverRequestParams {
  position: Position;
  textDocument: {
    uri: string;
  };
}

/**
 * textDocument/hover -- Response
 */
export interface HoverResult extends ResponseMsg {
  result: Hover;
}

export interface Hover {
  contents: string;
}

export function hoverResponse(
  reqId: number | string,
  contents: string,
): HoverResult {
  const hoverRes: HoverResult = {
    jsonrpc: "2.0",
    id: reqId,
    result: {
      contents: contents,
    },
  };
  return hoverRes;
}

/*
 * textDocument/definition -- Request
 * */
export interface DefinitionRequestParams {
  textDocument: {
    uri: string;
  };
  position: Position;
}

/*
 * textDocument/definition -- Response
 * */
export interface DefinitionResult extends ResponseMsg {
  result: Location;
}

export interface Location {
  uri: string;
  range: Range;
}

// set the line and character for goto definition manually, just for demonstration on this project.
export function definitionResponse(
  reqId: number | string,
  targetUri: string,
): DefinitionResult {
  const defRes: DefinitionResult = {
    jsonrpc: "2.0",
    id: reqId,
    result: {
      uri: targetUri,
      range: {
        start: {
          line: 0,
          character: 40,
        },
        end: {
          line: 0,
          character: 41,
        },
      },
    },
  };
  return defRes;
}

/*
 * textDocument/codeAction -- Request
 * */
export interface CodeActionParams {
  textDocument: {
    uri: string;
  };
  range: Range;
  context: CodeActionContext;
}

export interface CodeActionContext {
  diagnostics: Diagnostic[];
}

export interface Diagnostic {
  range: Range;
  message: string;
}

/*
 * textDocument/codeAction -- Response
 * */
export interface CodeActionResult extends ResponseMsg {
  result: CodeAction[];
}

export interface CodeAction {
  title: string;
  edit: WorkspaceEdit;
}

export interface WorkspaceEdit {
  changes: { [uri: string]: TextEdit[] };
}

export interface TextEdit {
  range: Range;
  newText: string;
}

export function codeActionResponse(
  reqId: string | number,
  uri: string,
  content: string,
): CodeActionResult {
  const changes: { [uri: string]: TextEdit[] } = {};
  const textEdits: TextEdit[] = genTextEditsForSadWords(content);
  changes[uri] = textEdits;

  const codeAction: CodeAction = {
    title: "Change all 'sad' to 'grateful'",
    edit: {
      changes: changes,
    },
  };

  const codeActionRes: CodeActionResult = {
    jsonrpc: "2.0",
    id: reqId,
    result: [codeAction],
  };
  return codeActionRes;
}

// finds line numbers and ranges where word "sad" is present.
// creates and returns an array of TextEdit.
// NOTE: Using indexOf() would be much better and less buggy, however,
// I wanted to write my own for loops for this personal project.
function genTextEditsForSadWords(content: string): TextEdit[] {
  const lines: string[] = content.split("\n");
  console.error(JSON.stringify(lines));
  let lineNum: number = 0;
  let textEdits: TextEdit[] = [];

  for (const line of lines) {
    for (let i: number = 0; i < line.length; i++) {
      for (let j: number = i; j < line.length; j++) {
        if (line[j] !== " " && j !== line.length - 1) {
          continue;
        }
        const endRange: number = line[j] === " " ? j : j + 1;
        let currWord: string = line.slice(i, endRange);
        if (currWord === "sad") {
          const textEdit: TextEdit = {
            range: {
              start: {
                line: lineNum,
                character: i,
              },
              end: {
                line: lineNum,
                character: endRange,
              },
            },
            newText: "grateful",
          };
          textEdits.push(textEdit);
        }
        i = j;
        break;
      }
    }
    lineNum++;
  }

  return textEdits;
}

/*
 * textDocument/completion -- Request
 * */
export interface CompletionParams {
  textDocument: {
    uri: string;
  };
  position: Position;
  context: CompletionContext;
}

export interface CompletionContext {
  triggerKind: number;
}

/*
 * textDocument/completion -- Response
 * */
export interface CompletionResult extends ResponseMsg {
  result: CompletionItem[];
}

export interface CompletionItem {
  label: string;
  detail: string;
  documentation: string;
}

export function completionResponse(reqId: string | number): CompletionResult {
  const compItemOne: CompletionItem = {
    label: "Blessed and Grateful ",
    detail: "Always be grateful. \n",
    documentation: `
When it comes to life, the critical thing is whether you 
take things for granted or take them with gratitude. 
G.K. Chesterton`,
  };

  const compRes: CompletionResult = {
    jsonrpc: "2.0",
    id: reqId,
    result: [compItemOne],
  };
  return compRes;
}

/*
 * Common
 * */
export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number; // line position in a document
  character: number; // character offset on a line in a document.
}
