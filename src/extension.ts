// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as git from './git';
import {
	ExtensionContext,
	window,
	workspace,
	Position,
	Range,
	DecorationOptions,
 } from 'vscode';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let activeEditor = window.activeTextEditor;
	const gitBlameText = window.createTextEditorDecorationType(
		{
			after: {
				color: 'gray',
				margin: '0 0 0 3em'
			}
		}
	);

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const cursorLine = activeEditor.selection.active.line;

		// get position at the end of the line
		const endOfLine = activeEditor.document.lineAt(cursorLine).range.end;
		const endOfLinePosition = new Position(cursorLine, endOfLine.character);
		const endOfLinePositionWithOffset = new Position(cursorLine, endOfLine.character);

		const lineBlameMessage = getBlameForLine(
			getWorkspaceDirectory(), 
			activeEditor.document.uri.fsPath.replace(getWorkspaceDirectory(), ''),
			cursorLine + 1);

		const decoration: DecorationOptions = {
			range: new Range(endOfLinePosition, endOfLinePositionWithOffset),
			hoverMessage: 'Blame: ',
			renderOptions: {
				after: {
					contentText: lineBlameMessage.padStart(40),
					color: 'gray',
					margin: '0 0 0 3em'
				}
			}
		};

		activeEditor.setDecorations(gitBlameText, [decoration]);
	}

	if (activeEditor) {
		updateDecorations();
	}

	window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			updateDecorations();
		}
	}, null, context.subscriptions);

	workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations();
		}
	}, null, context.subscriptions);

	window.onDidChangeTextEditorSelection(event => {
		if (activeEditor && event.textEditor === activeEditor) {
			updateDecorations();
		}
	}, null, context.subscriptions);

}

function getWorkspaceDirectory() {
	return workspace.workspaceFolders?.[0].uri.fsPath ?? "no workspace";
}

function getBlameForLine(workspaceDirectory: string, currentFile: string, cursorLine: number): string {
	let lineBlame = git.getGitLineBlame(workspaceDirectory, currentFile, cursorLine);
	return lineBlame;
}
