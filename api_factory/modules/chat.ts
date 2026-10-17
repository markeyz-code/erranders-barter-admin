import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Chat API — written against `barter/backend/src/chat/chat.controller.ts`
 * (`@Controller('chats')`, every route JWT-guarded).
 *
 * The admin had a `dashboard/chats.vue` page and NO chat module at all. The
 * website's equivalent module was broken because it called a different product's
 * API (`/chat/rooms/*`); this one is written against what actually exists.
 *
 * NOTE: `axios.config.ts` already carries the `/api/v1` prefix.
 */

export interface ChatParticipant {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  sender: ChatParticipant | string;
  content: string;
  type?: string;
  assetUrl?: string;
  replyTo?: ChatMessage | string;
  createdAt?: string;
}

export interface Chat {
  _id: string;
  participants: ChatParticipant[];
  item?: { _id: string; title?: string } | string;
  lastMessage?: ChatMessage | string;
  createdAt?: string;
  updatedAt?: string;
}

export const chatApi = {
  /** GET /chats — the caller's conversations, newest first. */
  getChats: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Chat[]>('/chats'),

  /** GET /chats/:chatId/messages — oldest first. 403 unless you are a participant. */
  getMessages: (chatId: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<ChatMessage[]>(`/chats/${chatId}/messages`),

  /** POST /chats/init — find or create a conversation with another user. */
  initChat: (payload: { participantId: string; itemId?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Chat>('/chats/init', payload),

  /**
   * POST /chats/:chatId/messages — send a message.
   *
   * This route did not exist. Only the socket gateway could send, so the admin
   * had no way to reply and its compose box pushed into a local array. The same
   * participant check guards it.
   */
  sendMessage: (
    chatId: string,
    payload: { content: string; type?: string; assetUrl?: string; replyTo?: string }
  ) => GATEWAY_ENDPOINT_WITH_AUTH.post<ChatMessage>(`/chats/${chatId}/messages`, payload),
};

export default chatApi;
