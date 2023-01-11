// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as git from './git';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-stuff" is now active!');
	const currentFile = getCurrentFile();
	const workspaceDirectory = getWorkspaceDirectory();
	const cursorLine = getCursorLine();


	console.table([
		{
			name: "Workspace Directory",
			value: workspaceDirectory
		},
		{
			name: "Cursor Is On Line",
			value: cursorLine
		},
		{
			name: "Active File",
			value: currentFile
		}]);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('git-stuff.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World vs-code!');
	});

	context.subscriptions.push(disposable);

	let lineBlame = git.getGitLineBlame(workspaceDirectory, currentFile, cursorLine);
	console.log("lineBlame: " + lineBlame);

	vscode.window.showInformationMessage(lineBlame);

	setInterval(() => {
		const currentFile = getCurrentFile();
		const workspaceDirectory = getWorkspaceDirectory();
		const cursorLine = getCursorLine();
		let lineBlame = git.getGitLineBlame(workspaceDirectory, currentFile, cursorLine);
		console.log("lineBlame: " + lineBlame + ", cursorLine: " + cursorLine);
	}, 1000);


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

// This method is called when your extension is deactivated
export function deactivate() { }
