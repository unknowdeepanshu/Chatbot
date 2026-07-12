import { Bot } from "lucide-react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

type message = {
  human: string;
  ai: string;
};

interface MessageShow {
  ChatData: Record<string, message[]>;

  activeChatId: string;
}

export default function MessageShow({ ChatData, activeChatId }: MessageShow) {
  const activeMessages = ChatData[activeChatId] ?? [];

  return (
    <div className="mt-40 flex flex-col">
      {activeMessages.length === 0 ? (
        <div className="flex w-full max-w-sm flex-col gap-1 py-4">
          <p className="text-muted-foreground text-sm font-medium">
            start chat
          </p>
        </div>
      ) : (
        <div className="mb-6 w-[24rem]">
          {activeMessages.map((message, index) => (
            <div
              key={index}
              className="flex w-full max-w-sm flex-col gap-1 py-4"
            >
              <Bubble align="end">
                <BubbleContent>{message.human}</BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <Bot />
                <BubbleContent>{message.ai}</BubbleContent>
              </Bubble>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
