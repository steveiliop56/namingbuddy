import { Ollama } from "ollama";

export class OllamaHandler {
  private ollama: Ollama;
  private ollamaModel: string;

  constructor(ollamaUrl: string, ollamaModel = "llama3") {
    this.ollama = new Ollama({ host: ollamaUrl });
    this.ollamaModel = ollamaModel;
  }

  public async generateFunctionName(selection: string) {
    try {
      const prompt = `Generate a better function name for this function: ${selection}. Respond only with the function name and nothing else.`;
      const message = { role: "user", content: prompt };
      const response = await this.ollama.chat({
        model: this.ollamaModel,
        messages: [message],
        stream: false,
      });
      return { success: true, message: response.message.content };
    } catch (e) {
      return { success: false, message: e };
    }
  }

  public async generateClassName(selection: string) {
    try {
      const prompt = `Generate a better class name for this class: ${selection}. Respond only with the class name and nothing else.`;
      const message = { role: "user", content: prompt };
      const response = await this.ollama.chat({
        model: this.ollamaModel,
        messages: [message],
        stream: false,
      });
      return { success: true, message: response.message.content };
    } catch (e) {
      return { success: false, message: e };
    }
  }

  public async generateVariableName(variableName: string, code: string) {
    try {
      const prompt = `Generate a better variable name for the variable ${variableName}. Here are the lines where my variable is being used: ${code}. Respond only with the variable name and nothing else.`;
      const message = { role: "user", content: prompt };
      const response = await this.ollama.chat({
        model: this.ollamaModel,
        messages: [message],
        stream: false,
      });
      return { success: true, message: response.message.content };
    } catch (e) {
      return { success: false, message: e };
    }
  }
}
