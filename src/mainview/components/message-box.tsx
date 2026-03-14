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
        <div className="w-full rounded-xl border bg-white p-1.5 text-sm shadow-lg hover:border-gray-300">
            <form className="flex flex-col justify-between gap-1" onSubmit={form.handleSubmit(onSubmit)}>
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
                                className="max-h-50 min-h-10 resize-none overflow-y-auto border-none pb-0 shadow-none focus-visible:ring-0"
                            />
                            <FieldError className="px-3" errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                        <Button variant="outline" className="size-9 p-0" type="button">
                            <PaperclipIcon />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="outline" size="sm" className="flex size-9 p-0">
                                    <FadersHorizontalIcon />
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="[--radius:0.95rem] flex flex-col items-start gap-1 p-1.5 w-auto"
                            >
                                {/*<DropdownMenuItem*/}
                                {/*    className="flex w-60 items-center justify-between p-1.5 focus:bg-white"*/}
                                {/*    onSelect={(e) => e.preventDefault()}*/}
                                {/*>*/}
                                {/*    <div className="flex items-center gap-2">*/}
                                {/*        <GlobeIcon className="size-5" />*/}
                                {/*        <div className="flex flex-col">*/}
                                {/*            <span className="text-base">Search</span>*/}
                                {/*            <span className="text-xs text-gray-600">Disable to not search</span>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*    <Switch />*/}
                                {/*</DropdownMenuItem>*/}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex">
                        {/*<DropdownMenu>*/}
                        {/*    <DropdownMenuTrigger asChild>*/}
                        {/*        <InputGroupButton variant="outline" className="h-9 w-auto hover:bg-gray-200">*/}
                        {/*            Auto*/}
                        {/*        </InputGroupButton>*/}
                        {/*    </DropdownMenuTrigger>*/}
                        {/*    <DropdownMenuContent*/}
                        {/*        side="top"*/}
                        {/*        align="end"*/}
                        {/*        className="[--radius:0.95rem] flex flex-col items-start gap-1 p-1.5 w-auto"*/}
                        {/*    >*/}
                        {/*        <DropdownMenuItem className="flex w-60 flex-col items-start gap-1 p-1.5 focus:bg-gray-200">*/}
                        {/*            <span className="font-base">Auto</span>*/}
                        {/*            <span className="text-gray-600 font-sm">Automatically select model</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*        <Separator />*/}
                        {/*        <DropdownMenuItem className="flex w-60 flex-col items-start gap-1 p-1.5 focus:bg-gray-200">*/}
                        {/*            <span className="font-base">V2</span>*/}
                        {/*            <span className="text-gray-600 font-sm">Flagship model</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*        <DropdownMenuItem className="flex w-60 flex-col items-start gap-1 p-1.5 focus:bg-gray-200">*/}
                        {/*            <span className="font-base">V2-Flash</span>*/}
                        {/*            <span className="text-gray-600 font-sm">Highly cost-effective model</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*        <DropdownMenuItem className="flex w-60 flex-col items-start gap-1 p-1.5 focus:bg-gray-200">*/}
                        {/*            <span className="font-base">V1.5</span>*/}
                        {/*            <span className="text-gray-600 font-sm">Excellent knowledge model</span>*/}
                        {/*        </DropdownMenuItem>*/}
                        {/*    </DropdownMenuContent>*/}
                        {/*</DropdownMenu>*/}

                        {/*<Separator orientation="vertical" className="mx-3" />*/}
                        <Button className="size-9" type="submit" disabled={!canSubmit}>
                            <PaperPlaneRightIcon />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}