import { useEffect, useRef } from "react";
import { BrainIcon } from "@phosphor-icons/react";
import { type ChatCompletionMessage } from "@/lib/rpc.ts";

interface ChatMessageListProps {
    messages: ChatCompletionMessage[];
    isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading = false }: ChatMessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const visibleMessages = messages.filter((m) => m.role !== "system");

    if (visibleMessages.length === 0 && !isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 select-none h-full">
                Midorin Cowork
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 px-4 py-6 h-full">
            {visibleMessages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="text-base leading-relaxed whitespace-pre-wrap wrap-break-word font-sans max-w-full text-gray-900">
                        Processing...
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

interface ChatMessageProps {
    message: ChatCompletionMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row pb-10"}`}>
            <div className={`mt-1 shrink-0 size-6`}>
                <BrainIcon className={`${isUser ? "hidden" : "size-6"}`} />
            </div>

            <div
                className={`text-base leading-relaxed whitespace-pre-wrap wrap-break-word font-sans
                    ${isUser
                    ? "max-w-[75%] rounded-2xl px-3 py-2 rounded-tr-sm bg-gray-100 text-gray-900"
                    : "max-w-full text-gray-900 pt-1 px-2.5"
                }
                `}
            >
                {message.content}
            </div>

            <div className={`mt-1 shrink-0 size-6`} />
        </div>
    );
}

