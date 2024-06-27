import * as vscode from "vscode";
import { OllamaHandler } from "./lib/ollama";

export class CommandsClass {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private registerCommand(id: string, callback: (...args: any[]) => any) {
    this.context.subscriptions.push(
      vscode.commands.registerCommand(id, callback),
    );
  }

  public registerSetOllamaUrlCommand() {
    const commandId = "namingbuddy.setOllamaUrl";
    const commandCallback = async () => {
      const ollamaUrlKey = "namingbuddyOllamaUrl";

      const ollamaUrl = await vscode.window.showInputBox({
        placeHolder: "http://localhost:11434",
        prompt: "Enter your ollama server URL",
      });

      this.context.globalState.setKeysForSync([ollamaUrlKey]);
      this.context.globalState.update(ollamaUrlKey, ollamaUrl);
      vscode.window.showInformationMessage("Ollama URL updated");
    };
    this.registerCommand(commandId, commandCallback);
  }

  public registerShowOllamaUrlCommand() {
    const commandId = "namingbuddy.showOllamaUrl";
    const commandCallback = () => {
      const ollamaUrl = this.context.globalState.get("namingbuddyOllamaUrl");

      vscode.window.showInformationMessage(
        `Your current ollama url is: ${String(ollamaUrl)}`,
      );
    };
    this.registerCommand(commandId, commandCallback);
  }

  public registerGenerateFunctionNameCommand() {
    const commandId = "namingbuddy.generateFunctionName";
    const commandCallback = async () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.document.getText(editor.selection);

      if (typeof selection === "undefined" || selection === "") {
        vscode.window.showErrorMessage(
          "Please select some code to generate a function name",
        );
        return;
      }

      const ollamaUrl = this.context.globalState.get("namingbuddyOllamaUrl");

      if (typeof ollamaUrl === "undefined") {
        vscode.window.showErrorMessage("Please set an ollama URL");
        return;
      }

      const ollama = new OllamaHandler(String(ollamaUrl));

      vscode.window.withProgress(
        {
          title: `Generating a function name...`,
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          return new Promise<void>(async (resolve, reject) => {
            await ollama.generateFunctionName(selection).then((result) => {
              if (result.success) {
                vscode.window.showInformationMessage(
                  `Your new awesome function name is: ${result.message}`,
                );
                resolve();
              } else {
                vscode.window.showErrorMessage(
                  `Failed to generate. Error: ${result.message}`,
                );
                reject();
              }
            });
          });
        },
      );
    };
    this.registerCommand(commandId, commandCallback);
  }

  public registerGenerateClassNameCommand() {
    const commandId = "namingbuddy.generateClassName";
    const commandCallback = async () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.document.getText(editor.selection);

      if (typeof selection === "undefined" || selection === "") {
        vscode.window.showErrorMessage(
          "Please select some code to generate a class name",
        );
        return;
      }

      const ollamaUrl = this.context.globalState.get("namingbuddyOllamaUrl");

      if (typeof ollamaUrl === "undefined") {
        vscode.window.showErrorMessage("Please set an ollama URL");
        return;
      }

      const ollama = new OllamaHandler(String(ollamaUrl));

      vscode.window.withProgress(
        {
          title: `Generating a class name...`,
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          return new Promise<void>(async (resolve, reject) => {
            await ollama.generateClassName(selection).then((result) => {
              if (result.success) {
                vscode.window.showInformationMessage(
                  `Your new awesome class name is: ${result.message}`,
                );
                resolve();
              } else {
                vscode.window.showErrorMessage(
                  `Failed to generate. Error: ${result.message}`,
                );
                reject();
              }
            });
          });
        },
      );
    };
    this.registerCommand(commandId, commandCallback);
  }

  public registerGenerateVariableNameCommand() {
    const commandId = "namingbuddy.generateVariableName";
    const commandCallback = async () => {
      const editor = vscode.window.activeTextEditor;
      const file = editor?.document.getText();

      if (typeof file === "undefined" || file === "") {
        vscode.window.showErrorMessage(
          "Please write some code or open a file to generate a variable name for",
        );
        return;
      }

      const variableToGenerateFor = await vscode.window.showInputBox({
        placeHolder: "myAwesomeVariable",
        prompt: "Enter the variable you want to generate a better name for",
      });

      if (
        typeof variableToGenerateFor === "undefined" ||
        variableToGenerateFor === ""
      ) {
        vscode.window.showErrorMessage(
          "Please type a variable name in order to generate a better one",
        );
        return;
      }

      const splittedFile = file.split("\n");

      let finalArray: string[] = [];

      for (const line of splittedFile) {
        if (line.includes(variableToGenerateFor)) {
          finalArray.push(line);
        }
      }

      const ollamaUrl = this.context.globalState.get("namingbuddyOllamaUrl");

      if (typeof ollamaUrl === "undefined") {
        vscode.window.showErrorMessage("Please set an ollama URL");
        return;
      }

      const ollama = new OllamaHandler(String(ollamaUrl));

      vscode.window.withProgress(
        {
          title: `Generating a variable name...`,
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
        },
        async () => {
          return new Promise<void>(async (resolve, reject) => {
            await ollama
              .generateVariableName(
                variableToGenerateFor,
                finalArray.join("\n"),
              )
              .then((result) => {
                if (result.success) {
                  vscode.window.showInformationMessage(
                    `Your new awesome variable name is: ${result.message}`,
                  );
                  resolve();
                } else {
                  vscode.window.showErrorMessage(
                    `Failed to generate. Error: ${result.message}`,
                  );
                  reject();
                }
              });
          });
        },
      );
    };
    this.registerCommand(commandId, commandCallback);
  }
}
