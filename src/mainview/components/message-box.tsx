import { useEffect, useRef } from "react";
import { FadersHorizontalIcon, PaperPlaneRightIcon, PaperclipIcon } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

const messageBoxClasses = {
    container:
        "w-full rounded-2xl border border-border/60 bg-background p-2 text-sm shadow-sm transition-colors hover:border-border focus-within:border-border focus-within:shadow-md",
    form: "flex flex-col justify-between gap-1.5",
    textarea:
        "min-h-10 max-h-50 resize-none overflow-y-auto border-none pb-0 shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0",
    fieldError: "px-3",
    controls: "flex items-center justify-between px-0.5",
    controlsLeft: "flex items-center gap-1",
    ghostIconButton: "size-8 rounded-lg p-0 text-muted-foreground/70 hover:text-foreground",
    icon: "size-4",
    dropdownContent: "[--radius:0.95rem] flex w-auto flex-col items-start gap-1 p-1.5",
    dropdownItem: "flex min-w-56 items-center justify-between gap-3",
    controlsRight: "flex",
    submitButton: "size-8 rounded-lg transition-opacity",
};

const formSchema = z.object({
    userPrompt: z.string().min(1, {
        message: "Message must be at least 1 character.",
    }),
});

type MessageFormValues = z.infer<typeof formSchema>;

interface MessageBoxProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    streamingEnabled: boolean;
    onStreamingEnabledChange: (enabled: boolean) => void;
}

export function MessageBox({
    onSendMessage,
    disabled = false,
    streamingEnabled,
    onStreamingEnabledChange,
}: MessageBoxProps) {
    const form = useForm<MessageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userPrompt: "",
        },
    });

    const promptValue = form.watch("userPrompt");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [promptValue]);

    async function onSubmit(values: MessageFormValues) {
        onSendMessage(values.userPrompt);
        form.reset();
    }

    const canSubmit = promptValue.trim().length > 0 && !form.formState.isSubmitting && !disabled;

    return (
        <div className={messageBoxClasses.container}>
            <form className={messageBoxClasses.form} onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    name="userPrompt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Textarea
                                placeholder="Ask Anything..."
                                {...field}
                                aria-invalid={fieldState.invalid}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        void form.handleSubmit(onSubmit)();
                                    }
                                }}
                                ref={(el) => {
                                    field.ref(el);
                                    textareaRef.current = el;
                                }}
                                className={messageBoxClasses.textarea}
                            />
                            <FieldError className={messageBoxClasses.fieldError} errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className={messageBoxClasses.controls}>
                    <div className={messageBoxClasses.controlsLeft}>
                        <Button variant="ghost" className={messageBoxClasses.ghostIconButton} type="button">
                            <PaperclipIcon className={messageBoxClasses.icon} />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="ghost" size="sm" className={messageBoxClasses.ghostIconButton}>
                                    <FadersHorizontalIcon className={messageBoxClasses.icon} />
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className={messageBoxClasses.dropdownContent}
                            >
                                <DropdownMenuLabel>Response</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className={messageBoxClasses.dropdownItem}
                                    onSelect={(event) => {
                                        event.preventDefault();
                                        onStreamingEnabledChange(!streamingEnabled);
                                    }}
                                >
                                    <span className="text-sm">Streaming</span>
                                    <Switch
                                        checked={streamingEnabled}
                                        onCheckedChange={onStreamingEnabledChange}
                                        aria-label="Toggle streaming"
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className={messageBoxClasses.controlsRight}>
                        <Button className={messageBoxClasses.submitButton} type="submit" disabled={!canSubmit}>
                            <PaperPlaneRightIcon className={messageBoxClasses.icon} />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
