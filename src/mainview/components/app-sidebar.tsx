import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { CaretUpDownIcon, GearIcon, GraphIcon, PlusIcon } from "@phosphor-icons/react";

export function AppSidebar({ onNavigate }: { onNavigate: (view: "chat" | "settings") => void }) {
    const { isMobile } = useSidebar()

    return (
        <Sidebar variant="floating" className="py-1.5 pl-1.5 pr-0 *:data-[slot=sidebar-inner]:rounded-2xl *:data-[slot=sidebar-inner]:bg-background *:data-[slot=sidebar-inner]:text-foreground *:data-[slot=sidebar-inner]:shadow-none *:data-[slot=sidebar-inner]:ring-0">
            <SidebarHeader className=" bg-gray-100">
                <div className="flex h-10 justify-center items-center gap-2">
                    <GraphIcon size={24} />
                    <span className="text-base font-medium">Midorin Cowork</span>
                </div>
            </SidebarHeader>
            <SidebarContent className=" bg-gray-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            onClick={() => onNavigate("chat")}
                        >
                            <PlusIcon />
                            新しい会話
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="bg-gray-100 p-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-gray-200" asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-full">
                                        <AvatarImage src="" alt="ユーザーのアバター画像" />
                                        <AvatarFallback className="rounded-full">MC</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">ユーザー名</span>
                                    </div>
                                    <CaretUpDownIcon className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-full">
                                                <AvatarImage src="" alt="ユーザーのアバター画像" />
                                                <AvatarFallback className="rounded-full">MC</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">ユーザー名</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onSelect={() => onNavigate("settings")}>
                                        <a href="#">
                                            <div className="flex items-center gap-2 text-left text-sm">
                                                <GearIcon />
                                                Settings
                                            </div>
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
