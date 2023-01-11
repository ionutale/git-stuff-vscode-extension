import * as vscode from 'vscode';

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

  private codeLenses: vscode.CodeLens[] = [];
  private lineNumber: number = 0;
  private blame: string = "";

  constructor(lineNumber: number, blame: string) {
    this.lineNumber = lineNumber;
    this.blame = blame;
  }

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

    this.codeLenses = [];
    const position = new vscode.Position(this.lineNumber, 1);
    const range = document.getWordRangeAtPosition(position, /./);
    if (range) {
      this.codeLenses.push(new vscode.CodeLens(range));
    }
    return this.codeLenses;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    codeLens.command = {
      title: `${this.lineNumber}-Blame: ${this.blame}`,
      tooltip: "Tooltip provided by sample extension",
      command: "codelens-sample.codelensAction",
      arguments: ["Argument 1", false]
    };
    return codeLens;
  }
}

