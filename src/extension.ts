import * as vscode from "vscode";
import { CommandsClass } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const commands = new CommandsClass(context);
  commands.registerGenerateVariableNameCommand();
  commands.registerGenerateFunctionNameCommand();
  commands.registerGenerateClassNameCommand();
  commands.registerShowOllamaUrlCommand();
  commands.registerSetOllamaUrlCommand();
}

export function deactivate() {}
