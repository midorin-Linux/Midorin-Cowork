import type { ChatCompletionMessage } from "./types.ts";

const API_ENDPOINT = process.env.API_ENDPOINT;
const API_KEY = process.env.API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

export async function createChatCompletion(messages: ChatCompletionMessage[]) {
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
    return await response.json();
}