import { useEffect, useRef, useState } from "react";
import { BrainIcon } from "@phosphor-icons/react";
import { type ChatCompletionMessage, markdownToHTML } from "@/lib/rpc.ts";
import { cn } from "@/lib/utils.ts";

const chatMessageClasses = {
    emptyState:
        "flex h-full flex-1 select-none flex-col items-center justify-center gap-2 text-sm tracking-wide text-muted-foreground/60",
    emptyStateTitle: "text-base font-medium text-muted-foreground/80",
    list: "flex min-h-full flex-col gap-5 px-4 py-8 md:gap-6 md:px-6",
    loadingRow: "flex flex-row items-start gap-3 pb-6",
    avatarWrap: "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
    loadingDotsWrap: "flex items-center gap-1.5 pt-2.5",
    loadingDot: "size-1.5 animate-bounce rounded-full bg-muted-foreground/60",
    rowBase: "flex items-start gap-3",
    rowAssistant: "flex-row pb-6",
    rowUser: "flex-row-reverse",
    avatarSlot: "mt-0.5 shrink-0",
    userBubble:
        "max-w-[78%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm border border-border/40 bg-muted/80 px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-foreground shadow-sm",
    assistantBubble:
        "prose-chat max-w-full min-w-0 whitespace-pre-wrap break-words rounded-2xl px-1 py-0.5 text-[0.9375rem] leading-6 text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-blue-600 [&_hr]:my-4 [&>h1]:mb-3 [&>h1]:mt-4 [&>h1]:first:mt-0 [&>h2]:mb-2 [&>h2]:mt-3.5 [&>h2]:first:mt-0 [&>h3]:mb-1.5 [&>h3]:mt-3 [&>h3]:first:mt-0 [&>h4]:mb-1 [&>h4]:mt-2.5 [&>h4]:first:mt-0 [&>h5]:mb-1 [&>h5]:mt-2 [&>h5]:first:mt-0 [&>h6]:mb-1 [&>h6]:mt-2 [&>h6]:first:mt-0 [&>p]:my-1.5 [&>blockquote]:my-3 [&>blockquote]:border-l-2 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>div]:my-2.5 [&>ol]:my-3 [&>ol]:list-outside [&>ol]:pl-5 [&>ul]:my-3 [&>ul]:list-outside [&>ul]:pl-5 [&_li]:pl-1 [&_li>p]:my-0 [&_li>p]:inline-block [&>ol>li]:marker:text-muted-foreground/80 [&>ul>li]:marker:text-muted-foreground/80 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:mt-1.5 [&>img]:my-2 [&>code]:px-[0.3rem] [&>code]:py-[0.2rem] [&_pre]:p-3 [&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5 [&>div>div:first-child]:px-3 [&>div>div:first-child]:py-1",
    streamingCursor: "mt-1 inline-block h-5 w-0.5 animate-pulse bg-muted-foreground/50",
    userSpacer: "mt-0.5 w-7 shrink-0",
    icon: "size-4",
};

interface ChatMessageListProps {
    messages: ChatCompletionMessage[];
    isLoading?: boolean;
    isStreamingActive?: boolean;
}

export function ChatMessageList({
    messages,
    isLoading = false,
    isStreamingActive = false,
}: ChatMessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const visibleMessages = messages.filter((m) => m.role !== "system");

    if (visibleMessages.length === 0 && !isLoading) {
        return (
            <div className={chatMessageClasses.emptyState}>
                <span className={chatMessageClasses.emptyStateTitle}>Midorin Cowork</span>
            </div>
        );
    }

    return (
        <div className={chatMessageClasses.list}>
            {visibleMessages.map((message, index) => (
                <ChatMessage
                    key={`${message.role}-${index}`}
                    message={message}
                    isStreaming={
                        isStreamingActive &&
                        index === visibleMessages.length - 1 &&
                        message.role === "assistant"
                    }
                />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={bottomRef} />
        </div>
    );
}

function LoadingIndicator() {
    return (
        <div className={chatMessageClasses.loadingRow}>
            <div className={chatMessageClasses.avatarWrap}>
                <BrainIcon className={chatMessageClasses.icon} />
            </div>
            <div className={chatMessageClasses.loadingDotsWrap}>
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className={chatMessageClasses.loadingDot}
                        style={{ animationDelay: `${i * 0.18}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

interface ChatMessageProps {
    message: ChatCompletionMessage;
    isStreaming?: boolean;
}

function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
    const isUser = message.role === "user";
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
        if (isUser) {
            setHtml(message.content);
            return;
        }
        markdownToHTML(message.content)
            .then(setHtml)
            .catch(() => setHtml(message.content));
    }, [message.content, isUser]);

    return (
        <div className={cn(chatMessageClasses.rowBase, isUser ? chatMessageClasses.rowUser : chatMessageClasses.rowAssistant)}>
            <div className={chatMessageClasses.avatarSlot}>
                {!isUser && (
                    <div className={chatMessageClasses.avatarWrap}>
                        <BrainIcon className={chatMessageClasses.icon} />
                    </div>
                )}
            </div>

            {isUser ? (
                <div className={chatMessageClasses.userBubble}>
                    {html}
                </div>
            ) : (
                <div
                    className={chatMessageClasses.assistantBubble}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            )}

            {!isUser && isStreaming && (
                <span className={chatMessageClasses.streamingCursor} />
            )}

            {isUser && <div className={chatMessageClasses.userSpacer} />}
        </div>
    );
}
