// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as git from './git';
import { CodelensProvider } from './CodelensProvider';
import { Disposable } from 'vscode';

let disposables: Disposable[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// const codelensProvider = new CodelensProvider();
	// vscode.languages.registerCodeLensProvider("*", codelensProvider);

	vscode.languages.registerCodeActionsProvider("*", {
		provideCodeActions(document, range, context, token) {
			disposables.forEach(item => item.dispose());
			disposables = [];
			
			const actions = [];
			actions.push(new vscode.CodeAction("Action 1", vscode.CodeActionKind.QuickFix));
			actions.push(new vscode.CodeAction("Action 2", vscode.CodeActionKind.QuickFix));
			console.log("provideCodeActions", document, range, context, token);
			let blame = getBlameForLine(
				getWorkspaceDirectory(),
				document.fileName.split('/').pop() ?? "no active editor",
				range.start.line + 1
			);

			const codelensProvider = new CodelensProvider(range.start.line, blame);
			const disp = vscode.languages.registerCodeLensProvider("*", codelensProvider);
			disposables.push(disp);
			return actions;
		}
	});
}

function getCurrentFile() {
	return vscode.window.activeTextEditor?.document.fileName.split('/').pop() ?? "no active editor";
}

function getWorkspaceDirectory() {
	return vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? "no workspace";
}

function getCursorLine() {
	return (vscode.window.activeTextEditor?.selection.active.line ?? 0) + 1;
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
