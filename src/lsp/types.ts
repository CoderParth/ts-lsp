export type LSPAny = LSPObject | LSPArray | string | number | boolean | null;

export type LSPObject = { [key: string]: LSPAny };

export type LSPArray = LSPAny[];
