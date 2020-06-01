// Copyright (c) 2020 Kody Brown.
// MIT License

import * as vscode from 'vscode';

// VS Code API: https://code.visualstudio.com/api/references/vscode-api

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // console.log('Congratulations, your extension "textutils" is now active!');

    let sortAscending = (a: string, b: string) => a.localeCompare(b);
    let sortDescending = (a: string, b: string) => b.localeCompare(a);

    let processTextSelection = (method: string) => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

            // Get the text of the selection.
            const selection = editor.selection;
            const text = document.getText(selection);

            let newText: string = text;

            switch (method) {
                case "reverseLines":
                    newText = text.split(eol).reverse().join(eol);
                    break;
                case "sortLinesAscending":
                    newText = text.split(eol).sort(sortAscending).join(eol);
                    break;
                case "sortLinesDescending":
                    newText = text.split(eol).sort(sortDescending).join(eol);
                    break;
                case "uniqueLines":
                    // https://www.samanthaming.com/tidbits/43-3-ways-to-remove-array-duplicates/
                    newText = [...new Set(text.split(eol))].join(eol);
                    break;
            }

            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    };

    let reverseCommand = vscode.commands.registerCommand('textutils.reverseLines', () => {
        processTextSelection("reverseLines");
    });
    context.subscriptions.push(reverseCommand);

    let sortAscendingCommand = vscode.commands.registerCommand('textutils.sortLinesAscending', () => {
        processTextSelection("sortLinesAscending");
    });
    context.subscriptions.push(sortAscendingCommand);

    let sortDescendingCommand = vscode.commands.registerCommand('textutils.sortLinesDescending', () => {
        processTextSelection("sortLinesDescending");
    });
    context.subscriptions.push(sortDescendingCommand);

    let uniqueLinesCommand = vscode.commands.registerCommand('textutils.uniqueLines', () => {
        processTextSelection("uniqueLines");
    });
    context.subscriptions.push(uniqueLinesCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }
