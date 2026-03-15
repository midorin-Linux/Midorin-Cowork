import type { ChatCompletionMessage } from "./types.ts";

type ChatCompletionResponse = {
    choices: {
        message: ChatCompletionMessage;
    }[];
};

const API_ENDPOINT = process.env.API_ENDPOINT;
const API_KEY = process.env.API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

export async function createChatCompletion(
    messages: ChatCompletionMessage[],
): Promise<ChatCompletionResponse> {
    const chat_completion_api_endpoint = `${API_ENDPOINT}/chat/completions`

    const response = await fetch(chat_completion_api_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            'model': MODEL_NAME,
            messages,
        }),
    });

    if(!response.ok) {
        const text = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${text}`);
    }
    return (await response.json()) as ChatCompletionResponse;
}

export async function createChatCompletionStream(
    messages: ChatCompletionMessage[],
    onChunk: (chunk: string) => void,
): Promise<string> {
    const chat_completion_api_endpoint = `${API_ENDPOINT}/chat/completions`;

    const response = await fetch(chat_completion_api_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            stream: true,
            messages,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${text}`);
    }

    if (!response.body) {
        throw new Error("API response has no stream body.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) {
                continue;
            }

            const data = line.slice(5).trim();
            if (data === "[DONE]") {
                continue;
            }

            try {
                const json = JSON.parse(data);
                const content = json?.choices?.[0]?.delta?.content;
                if (typeof content === "string" && content.length > 0) {
                    fullText += content;
                    onChunk(content);
                }
            } catch {
                // Ignore malformed stream chunks.
            }
        }
    }

    return fullText;
}
