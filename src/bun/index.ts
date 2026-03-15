import { BrowserView, BrowserWindow, type RPCSchema, Updater } from "electrobun/bun";
import { ChatHandler } from "./ai/chatHandler";
import { markdownToHTML } from "./ai/markdownToHTML.ts";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		try {
			await fetch(DEV_SERVER_URL, { method: "HEAD" });
			console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
			return DEV_SERVER_URL;
		} catch {
			console.log(
				"Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
			);
		}
	}
	return "views://mainview/index.html";
}

const url = await getMainViewUrl();

type AppRPCSchema = {
	bun: RPCSchema<{
		requests: {
			sendMessage: {
				params: [string];
				response: string;
			};
			getHistory: {
				params: [];
				response: { role: "system" | "user" | "assistant"; content: string }[];
			};
			clearHistory: {
				params: [];
				response: null;
			};
			markdownToHTML: {
				params: [string];
				response: string;
			};
		};
	}>;
};

const chatHandler = new ChatHandler();

const rpc = BrowserView.defineRPC<AppRPCSchema>({
	maxRequestTime: 60000,
	handlers: {
		requests: {
			sendMessage: async (message: string) => {
				return await chatHandler.sendMessage(message);
			},
			getHistory: () => {
				return chatHandler.getHistory();
			},
			clearHistory: () => {
				chatHandler.clearHistory();
				return null;
			},
			markdownToHTML: (message: string) => {
				return markdownToHTML(message);
			},
		},
	}
})

const mainWindow = new BrowserWindow({
	title: "Midorin Cowork",
	url,
	frame: {
		width: 900,
		height: 700,
		x: 200,
		y: 200,
	},
	rpc,
});

console.log("Vanilla Vite app started!");
