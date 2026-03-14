import { MessageBox } from "@/components/message-box.tsx";
import { ChatMessageList } from "@/components/chat-message.tsx";
import "./App.css";
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
        <div className="w-full bg-white relative h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-3xl h-full">
                    <ChatMessageList messages={messages} isLoading={isLoading} />
                </div>
            </div>
            <div className="p-3 bottom-0 w-full flex justify-center bg-linear-to-t from-white via-white to-transparent">
                <div className="w-full max-w-3xl">
                    <MessageBox
                        onSendMessage={handleSendMessage}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
