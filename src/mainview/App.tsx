import { MessageBox } from "@/components/message-box.tsx";
import { ChatMessageList } from "@/components/chat-message.tsx";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useRef, useState } from "react";
import {
    addStreamChunkListener,
    getHistory,
    sendMessage,
    sendStreamMessage,
    type ChatCompletionMessage,
} from "./lib/rpc";

function App() {
    const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingEnabled, setStreamingEnabled] = useState(true);
    const [streamingRequestId, setStreamingRequestId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<"chat" | "settings">("chat");
    const streamingRequestIdRef = useRef<string | null>(null);

    useEffect(() => {
        getHistory()
            .then((history) => setMessages(history))
            .catch((err) => console.error("getHistory error:", err));

        const unsubscribe = addStreamChunkListener(({ requestId, content }) => {
            setMessages((prev) => {
                const next = [...prev];
                const index = next.length - 1;

                if (index < 0 || next[index].role !== "assistant") {
                    return prev;
                }

                if (streamingRequestIdRef.current !== requestId) {
                    return prev;
                }

                next[index] = { role: "assistant", content };
                return next;
            });
        });

        return () => {
            unsubscribe();
        };
    }, []);

    async function handleSendMessage(message: string) {
        const userMessage: ChatCompletionMessage = { role: "user", content: message };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            if (streamingEnabled) {
                const requestId = crypto.randomUUID();
                streamingRequestIdRef.current = requestId;
                setStreamingRequestId(requestId);
                setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

                const fullReply = await sendStreamMessage({ message, requestId });
                setMessages((prev) => {
                    const next = [...prev];
                    const index = next.length - 1;
                    if (index >= 0 && next[index].role === "assistant") {
                        next[index] = { role: "assistant", content: fullReply };
                    }
                    return next;
                });
                return;
            }

            const reply = await sendMessage(message);
            const assistantMessage: ChatCompletionMessage = { role: "assistant", content: reply };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("RPC sendMessage error:", err);
        } finally {
            streamingRequestIdRef.current = null;
            setStreamingRequestId(null);
            setIsLoading(false);
        }
    }

    return (
        <SidebarProvider className="bg-gray-100">
            <AppSidebar onNavigate={setCurrentView} />
            <main className="h-screen w-screen p-1.5">
                <div className="relative flex h-full w-full flex-col rounded-md bg-background text-foreground">
                    <SidebarTrigger className="absolute rounded-2xl m-1" />

                    {currentView === "settings" ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-3xl p-8">
                                <h1 className="text-2xl font-semibold mb-4">Settings</h1>
                                {/* ここに設定項目を追加 */}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain scroll-smooth">
                                <div className="mx-auto h-full w-full max-w-3xl">
                                    <ChatMessageList
                                        messages={messages}
                                        isLoading={isLoading && !streamingRequestId}
                                        isStreamingActive={Boolean(streamingRequestId)}
                                    />
                                </div>
                            </div>
                            <div className="w-full shrink-0 rounded-2xl bg-linear-to-t from-background via-background/95 to-transparent px-4 pb-4">
                                <div className="mx-auto h-full w-full max-w-3xl">
                                    <MessageBox
                                        onSendMessage={handleSendMessage}
                                        disabled={isLoading}
                                        streamingEnabled={streamingEnabled}
                                        onStreamingEnabledChange={setStreamingEnabled}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default App;
