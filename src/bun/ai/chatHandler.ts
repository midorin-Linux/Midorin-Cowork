import { createChatCompletion } from "./openaiClient.ts";
import type { ChatCompletionMessage } from "./types.ts";

const SYSTEM_PROMPT = "You are a helpful assistant.";

export class ChatHandler {
    private history: ChatCompletionMessage[] = [];

    constructor(systemPrompt: string = SYSTEM_PROMPT) {
        this.history.push({
            role: "system",
            content: systemPrompt,
        });
    }

    async sendMessage(userMessage: string): Promise<string> {
        this.history.push({
            role: "user",
            content: userMessage,
        });

        const response = await createChatCompletion(this.history);
        const assistantMessage: ChatCompletionMessage = response.choices[0].message;

        this.history.push({
            role: "assistant",
            content: assistantMessage.content,
        });

        return assistantMessage.content;
    }

    getHistory(): ChatCompletionMessage[] {
        return [...this.history];
    }

    clearHistory(): void {
        const systemMessage = this.history[0];
        this.history = [systemMessage];
    }
}