// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as git from './git';
import { Disposable } from 'vscode';
import { text } from 'stream/consumers';

let disposables: Disposable[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let activeEditor = vscode.window.activeTextEditor;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const cursorLine = activeEditor.selection.active.line;

		// get position at the end of the line
		const endOfLine = activeEditor.document.lineAt(cursorLine).range.end;
		const endOfLinePosition = new vscode.Position(cursorLine, endOfLine.character);
		const endOfLinePositionWithOffset = new vscode.Position(cursorLine, endOfLine.character);

		const lineBlameMessage = getBlameForLine(getWorkspaceDirectory(), activeEditor.document.fileName.split('/').pop() ?? "no active editor", cursorLine + 1);
		console.log("lineBlameMessage: ", lineBlameMessage);
		const decoration: vscode.DecorationOptions = {
			range: new vscode.Range(endOfLinePosition, endOfLinePositionWithOffset),
			hoverMessage: 'Blame: ',
			renderOptions: {
				after: {
					contentText: lineBlameMessage.padStart(40),
					color: 'gray',
					margin: '0 0 0 3em'
				}
			}
		};

		const gitBlameText = vscode.window.createTextEditorDecorationType(
			{
				after: {
					color: 'gray',
					margin: '0 0 0 3em'
				}
			}
		);

		activeEditor.setDecorations(gitBlameText, [decoration]);
	}

	if (activeEditor) {
		updateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			updateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations();
		}
	}, null, context.subscriptions);

	vscode.window.onDidChangeTextEditorSelection(event => {
		if (activeEditor && event.textEditor === activeEditor) {
			updateDecorations();
		}
	}, null, context.subscriptions);

}

function getWorkspaceDirectory() {
	return vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? "no workspace";
}

function getBlameForLine(workspaceDirectory: string, currentFile: string, cursorLine: number): string {
	let lineBlame = git.getGitLineBlame(workspaceDirectory, currentFile, cursorLine);
	console.log("lineBlame: " + lineBlame + ", cursorLine: " + cursorLine);
	return lineBlame;
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
