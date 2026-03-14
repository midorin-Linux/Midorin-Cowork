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
};

const requests = rpc.request as BunRequests;

export async function sendMessage(message: string): Promise<string> {
    return requests.sendMessage(message);
}

export async function getHistory(): Promise<ChatCompletionMessage[]> {
    return requests.getHistory();
}

export async function clearHistory(): Promise<null> {
    return requests.clearHistory();
}

export { createRPC };
