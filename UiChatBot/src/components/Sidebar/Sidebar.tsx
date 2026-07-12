import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChatItem = {
  id: string;
  title: string;
};

type SidebarProps = {
  chats: ChatItem[];
  activeChatId: string;
  isOpen: boolean;
  onToggle: () => void;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (id: string) => void;
};

export default function Sidebar({
  chats,
  activeChatId,
  isOpen,
  onToggle,
  onCreateChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-border bg-background/95 flex h-full min-h-0 shrink-0 flex-col border-r transition-all duration-300",
        isOpen ? "w-72" : "w-16",
      )}
    >
      <div className="border-border flex items-center justify-between gap-2 border-b p-3">
        {isOpen ? (
          <div>
            <p className="text-foreground text-sm font-semibold">Chats</p>
            <p className="text-muted-foreground text-xs">
              Open and create chats
            </p>
          </div>
        ) : (
          <span className="text-foreground text-sm font-semibold"> </span>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <div className="border-border border-b p-3">
        <Button
          className="w-full justify-start gap-2"
          variant="default"
          onClick={onCreateChat}
        >
          <Plus />
          {isOpen ? <span>New Chat</span> : null}
        </Button>
      </div>

      <div className="max-h-[40%] flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {chats.map((chat) => {
            const active = chat.id === activeChatId;

            return (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-1 transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
                )}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "min-w-0 flex-1 justify-start truncate",
                    active && "bg-transparent",
                    !isOpen && "justify-center px-0",
                  )}
                  onClick={() => onSelectChat(chat.id)}
                  title={chat.title}
                >
                  {isOpen ? chat.title : chat.title.slice(0, 1)}
                </Button>
                {isOpen ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDeleteChat(chat.id)}
                    aria-label={`Delete ${chat.title}`}
                    title="Delete chat"
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
