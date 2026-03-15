import { MessageBox } from "@/components/message-box.tsx";
import { ChatMessageList } from "@/components/chat-message.tsx";
import { useState, useEffect } from "react";
import { sendMessage, getHistory, type ChatCompletionMessage } from "./lib/rpc";

function App() {
    const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getHistory()
            .then((history) => setMessages(history))
            .catch((err) => console.error("getHistory error:", err));
    }, []);

    async function handleSendMessage(message: string) {
        const userMessage: ChatCompletionMessage = { role: "user", content: message };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const reply = await sendMessage(message);
            const assistantMessage: ChatCompletionMessage = { role: "assistant", content: reply };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("RPC sendMessage error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative flex h-screen w-full flex-col bg-background text-foreground">
            <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
                <div className="mx-auto h-full w-full max-w-3xl">
                    <ChatMessageList messages={messages} isLoading={isLoading} />
                </div>
            </div>

            <div className="w-full shrink-0 bg-linear-to-t from-background via-background/95 to-transparent px-4 pb-4 pt-3">
                <div className="mx-auto w-full max-w-3xl">
                    <MessageBox onSendMessage={handleSendMessage} disabled={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default App;