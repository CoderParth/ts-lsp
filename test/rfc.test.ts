import { type RequestMsg } from "../src/lsp/message";
import { decodeMsg, encodeMsg } from "../src/rfc";

interface TestContent {
  method: string;
}

const testContent: TestContent = {
  method: "textDocument/completion",
};

test("encodes the message", () => {
  const expected: string = `Content-Length: 36\r\n\r\n{"method":"textDocument/completion"}`;
  expect(encodeMsg(testContent)).toBe(expected);
});

test("decodes the message", () => {
  const encoded: string = encodeMsg(testContent);
  const decoded: RequestMsg = decodeMsg(encoded);
  expect(decoded.method).toStrictEqual(testContent.method);
});
