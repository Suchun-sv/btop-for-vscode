import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "btop.openBtop",
    openBtop
  );

  context.subscriptions.push(disposable);
}

async function openBtop() {
  if (!(await focusActiveBtopInstance())) {
    await newBtopInstance();
  }
}

/**
 * Tries to find an instance and focus on the tab.
 * @returns If an instance was found and focused
 */
async function focusActiveBtopInstance(): Promise<boolean> {
  for (let openTerminal of vscode.window.terminals) {
    if (openTerminal.name === "btop") {
      openTerminal.show();
      return true;
    }
  }
  return false;
}

async function newBtopInstance() {
  // Always create a new terminal
  await vscode.commands.executeCommand(
    "workbench.action.terminal.newInActiveWorkspace"
  );

  let terminal = vscode.window.activeTerminal!;
  terminal.sendText("btop && exit");
  terminal.show();

  // Move the terminal to the editor area
  await vscode.commands.executeCommand(
    "workbench.action.terminal.moveToEditor"
  );

  // Move focus back to the editor view
  await vscode.commands.executeCommand(
    "workbench.action.focusActiveEditorGroup"
  );

  if (vscode.window.terminals.length > 1) {
    // Close the terminal if it's not the only one
    await vscode.commands.executeCommand("workbench.action.togglePanel");
  }
}

export function deactivate() {}
