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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";

const formSchema = z.object({
    userPrompt: z.string().min(1, {
        message: "Message must be at least 1 character.",
    }),
});

type MessageFormValues = z.infer<typeof formSchema>;

interface MessageBoxProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export function MessageBox({ onSendMessage, disabled = false }: MessageBoxProps) {
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
        <div className="w-full rounded-2xl border border-border/60 bg-background p-2 text-sm shadow-sm transition-colors focus-within:border-border focus-within:shadow-md hover:border-border">
            <form className="flex flex-col justify-between gap-1.5" onSubmit={form.handleSubmit(onSubmit)}>
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
                                className="min-h-10 max-h-50 resize-none overflow-y-auto border-none pb-0 shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                            />
                            <FieldError className="px-3" errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex items-center justify-between px-0.5">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" className="size-8 rounded-lg p-0 text-muted-foreground/70 hover:text-foreground" type="button">
                            <PaperclipIcon className="size-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="ghost" size="sm" className="flex size-8 rounded-lg p-0 text-muted-foreground/70 hover:text-foreground">
                                    <FadersHorizontalIcon className="size-4" />
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="[--radius:0.95rem] flex w-auto flex-col items-start gap-1 p-1.5"
                            />
                        </DropdownMenu>
                    </div>

                    <div className="flex">
                        <Button className="size-8 rounded-lg transition-opacity" type="submit" disabled={!canSubmit}>
                            <PaperPlaneRightIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}