import { useEffect, useState } from "react";

import InputGroupCustom from "./components/Chatbox/chatbot";
import MessageShow from "./components/MessageShow/MessageShow";
import Sidebar, { type ChatItem } from "./components/Sidebar/Sidebar";
import { api } from "./lib/axios";

type MessageItem = {
  human: string;
  ai: string;
};

type ChatData = Record<string, MessageItem[]>;

type ChatApiResponse = {
  threadID: string;
  conversationPairs: MessageItem[];
  showStore?: string[];
  status?: string;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatData, setChatData] = useState<ChatData>({});

  function handleCreateChat() {
    const nextNumber = chats.length + 1;
    const nextChat: ChatItem = {
      id: `chat-${nextNumber}`,
      title: `New Chat ${nextNumber}`,
    };

    setChats((currentChats) => [...currentChats, nextChat]);
    setChatData((currentChatData) => ({
      ...currentChatData,
      [nextChat.id]: [],
    }));
    setActiveChatId(nextChat.id);
    setIsSidebarOpen(true);
  }

  function handleDeletedChat(id: string) {
    const nextChats = chats.filter((chat) => chat.id !== id);

    setChats(nextChats);
    setChatData((currentChatData) => {
      const nextChatData = { ...currentChatData };
      delete nextChatData[id];
      return nextChatData;
    });

    if (activeChatId === id) {
      setActiveChatId(nextChats[0]?.id ?? "");
    }
  }

  const response = async (params: string, threadID?: string) => {
    const store = chats.map((e) => e.id);
    const res = await api.post("/Called", {
      userInput: params,
      threadID,
      ThreadIdStore: store,
    });
    return res.data as ChatApiResponse;
  };
  async function userMessage(message: string) {
    const currentThreadID = activeChat?.id ?? undefined;
    const responseData = await response(message, currentThreadID);

    const threadID = responseData.threadID;
    const conversationPairs = responseData.conversationPairs ?? [];

    setChats((currentChats) => {
      const exists = currentChats.some((chat) => chat.id === threadID);
      if (exists) {
        return currentChats.map((chat) =>
          chat.id === threadID ? { ...chat, title: chat.title } : chat,
        );
      }

      return [
        ...currentChats,
        {
          id: threadID,
          title: `New Chat ${currentChats.length + 1}`,
        },
      ];
    });

    setChatData((currentChatData) => ({
      ...currentChatData,
      [threadID]: conversationPairs,
    }));

    setActiveChatId(threadID);
  }

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];

  useEffect(() => {
    console.log("chatData updated", chatData);
  }, [chatData]);

  return (
    <section className="flex min-h-screen w-full overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((current) => !current)}
        onCreateChat={handleCreateChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeletedChat}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-border border-b px-6 py-4">
          <p className="text-muted-foreground text-sm font-medium">
            Active chat
          </p>
          <h1 className="text-black">{activeChat?.title ?? "New Chat"}</h1>
        </header>

        <div className="flex h-128 items-center justify-center overflow-auto px-6 py-5">
          <MessageShow activeChatId={activeChatId} ChatData={chatData} />
        </div>

        <div className="border-border border-t px-6 pt-4">
          <InputGroupCustom handlehandleSubmit={userMessage} />
        </div>
      </main>
    </section>
  );
}

export default App;
