import { type RequestMsg } from "./lsp/message";

export function encodeMsg(msg: any): string {
  let content: string = "";
  try {
    content = JSON.stringify(msg);
  } catch (error) {
    throw error;
  }
  return `Content-Length: ${content.length}\r\n\r\n${content}`;
}

export function decodeMsg(msg: string): RequestMsg {
  const header: string = parseHeader(msg);
  if (header.length === 0) {
    throw new Error("Invalid message. Recheck the header part.");
  }

  const declaredContentLen: number = getDeclaredLen(header);
  if (declaredContentLen === 0) {
    throw new Error("Invalid content-length. Recheck the header part.");
  }

  const content: string = getContent(msg, header.length, declaredContentLen);
  if (content.length === 0) {
    throw new Error("Invalid message. Rechceck the content part.");
  }

  let parsedContent: RequestMsg;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    throw error;
  }

  if (parsedContent.method !== undefined) {
    return parsedContent;
  }

  throw new Error("Invalid message. 'Method' not found in content");
}

// Returns the content length declared in the header.
// Example: Content-Length: 5\r\n\r\n
function getDeclaredLen(header: string): number {
  let decLen: number = 0;
  for (let i: number = 0; i < header.length; i++) {
    if (header[i] != " ") {
      continue;
    }
    i += 1; // To get to the beginning of the number.
    decLen = parseInt(header.slice(i, header.length));
    break;
  }
  return decLen;
}

function getContent(
  msg: string,
  headerLen: number,
  declaredLen: number,
): string {
  const startIdx: number = headerLen + 4; // +4 to skip "\r\n\r\n" before content
  if (startIdx + declaredLen > msg.length) {
    // Incomplete msg.
    return "";
  }
  return msg.slice(headerLen + 4, headerLen + 4 + declaredLen);
}

// Returns the first header part from the msg.
// Example:
// Content-Length: ...\r\n\r\n
function parseHeader(msg: string): string {
  for (let i: number = 0; i < msg.length; i++) {
    if (msg[i] != "\r") {
      continue;
    }
    return msg.slice(0, i); // the header
  }
  return ""; // Invalid msg.
}
