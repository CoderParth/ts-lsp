import { Diagnostic, Range } from "./textdocument";

export interface PublishDiagnosticsParams {
  jsonrpc: string;
  method: string;
  params: {
    uri: string;
    diagnostics: Diagnostic[];
    severity: number; // 1: error, 2: warning, 3: information, 4: hint
  };
}

export function prepDiagnosisResponse(
  uri: string,
  content: string,
): PublishDiagnosticsParams {
  const rangesOfDiagnosedMsgs: Range[] = findRangesForWordHard(content);
  const diagnosticArray: Diagnostic[] = diagnoses(rangesOfDiagnosedMsgs);

  const diagnosisResponse: PublishDiagnosticsParams = {
    jsonrpc: "2.0",
    method: "textDocument/publishDiagnostics",
    params: {
      uri: uri,
      diagnostics: diagnosticArray,
      severity: 3,
    },
  };

  return diagnosisResponse;
}

function diagnoses(ranges: Range[]): Diagnostic[] {
  let diagnosticArray: Diagnostic[] = [];
  for (const r of ranges) {
    const d: Diagnostic = {
      range: r,
      message: "Nothing is that hard. Struggle is the meaning of life.",
    };
    diagnosticArray.push(d);
  }
  return diagnosticArray;
}

// finds positions and ranges where the word "hard" is present.
// creates and returns an array of Range.
// NOTE: Using indexOf() would be much better and less buggy, however,
// I wanted to write my own for loops for this personal project.
function findRangesForWordHard(content: string): Range[] {
  const lines: string[] = content.split("\n");
  console.error(JSON.stringify(lines));
  let lineNum: number = 0;
  let ranges: Range[] = [];

  for (const line of lines) {
    for (let i: number = 0; i < line.length; i++) {
      for (let j: number = i; j < line.length; j++) {
        if (line[j] !== " " && j !== line.length - 1) {
          continue;
        }
        const endRange: number = line[j] === " " ? j : j + 1;
        let currWord: string = line.slice(i, endRange);
        if (currWord.toLowerCase() === "hard") {
          const range: Range = {
            start: {
              line: lineNum,
              character: i,
            },
            end: {
              line: lineNum,
              character: endRange,
            },
          };
          ranges.push(range);
        }
        i = j;
        break;
      }
    }
    lineNum++;
  }

  return ranges;
}
