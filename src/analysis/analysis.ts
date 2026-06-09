export class State {
  // Key: URI of the document
  // Value: Content of the document
  documents: Map<string, string>;

  constructor() {
    this.documents = new Map<string, string>();
  }

  saveState(uri: string, content: string) {
    this.documents.set(uri, content);
  }

  getStateOfDoc(uri: string): string {
    return this.documents.get(uri) ?? "";
  }
}
