import { Electroview, createRPC, type RPCSchema } from "electrobun/view";

type AppRPCSchema = {
    bun: RPCSchema<{
        requests: {
            sendMessage: {
                params: string;
                response: string;
            };
            getHistory: {
                params: void;
                response: { role: "system" | "user" | "assistant"; content: string }[];
            };
            clearHistory: {
                params: void;
                response: null;
            };
            markdownToHTML: {
                params: string;
                response: string;
            };
            sendStreamMessage: {
                params: { message: string; requestId: string };
                response: string;
            };
        };
    }>;
    webview: RPCSchema;
};

const rpc = Electroview.defineRPC<AppRPCSchema>({
    handlers: {
        requests: {},
        messages: {},
    },
    maxRequestTime: 60000,
});

new Electroview({ rpc });

export type ChatCompletionMessage = {
    role: "system" | "user" | "assistant";
    content: string;
}

type BunRequests = {
    sendMessage: (message: string) => Promise<string>;
    getHistory: () => Promise<ChatCompletionMessage[]>;
    clearHistory: () => Promise<null>;
    markdownToHTML: (message: string) => Promise<string>;
    sendStreamMessage: (params: { message: string; requestId: string }) => Promise<string>;
};

const requests = rpc.request as BunRequests;
const rpcAny = rpc as any;

type StreamChunkPayload = { requestId: string; content: string };

const streamChunkListeners = new Set<(payload: StreamChunkPayload) => void>();

rpcAny.addMessageListener("streamChunk", (payload: StreamChunkPayload) => {
    for (const listener of streamChunkListeners) {
        listener(payload);
    }
});

export async function sendMessage(message: string): Promise<string> {
    return requests.sendMessage(message);
}

export async function getHistory(): Promise<ChatCompletionMessage[]> {
    return requests.getHistory();
}

export async function clearHistory(): Promise<null> {
    return requests.clearHistory();
}

export async function markdownToHTML(message: string): Promise<string> {
    return requests.markdownToHTML(message);
}

export async function sendStreamMessage(params: { message: string; requestId: string }): Promise<string> {
    return requests.sendStreamMessage(params);
}

export function addStreamChunkListener(listener: (payload: StreamChunkPayload) => void): () => void {
    streamChunkListeners.add(listener);
    return () => {
        streamChunkListeners.delete(listener);
    };
}

export { createRPC };
