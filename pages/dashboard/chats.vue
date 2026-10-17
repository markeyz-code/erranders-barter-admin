<template>
  <div class="h-screen w-full flex flex-col bg-slate-50 relative">
    <div class="flex items-center justify-between shrink-0 p-4 sm:p-6 border-b border-slate-200 bg-white">
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Conversations</h2>
          <p class="text-sm text-slate-500 mt-1">
            Every chat here is one the signed-in account participates in. The API enforces that.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white flex-1 flex flex-col overflow-hidden">
      <!-- Error banner -->
      <div v-if="error" class="mx-4 mt-4 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 flex items-center justify-between gap-3">
        <p class="text-sm font-medium">{{ error }}</p>
        <button class="text-sm font-bold underline shrink-0" @click="reload">Try again</button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar (Chat List) -->
        <div class="w-80 border-r border-slate-100 flex flex-col bg-white">
          <div class="p-4 border-b border-slate-100">
            <input v-model="searchQuery" type="text" placeholder="Search conversations..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500">
          </div>
          <div class="flex-1 overflow-y-auto">
            <!-- Loading State for Chats -->
            <div v-if="loadingChats" class="flex justify-center p-4 sm:p-8">
              <Loader2 class="animate-spin text-brand-600 w-6 h-6" />
            </div>
            
            <div v-else-if="filteredChats.length === 0" class="p-6 text-center">
              <MessageSquare class="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p class="text-slate-500 font-medium text-sm">
                {{ chats.length === 0 ? 'No conversations yet' : 'No conversations match your search' }}
              </p>
            </div>

            <div v-else class="divide-y divide-slate-100">
              <div
                v-for="c in filteredChats"
                :key="c._id"
                class="p-4 hover:bg-slate-50 cursor-pointer transition-colors relative"
                :class="{ 'bg-brand-50/50': c._id === activeChatId }"
                @click="openChat(c)"
              >
                <div class="flex justify-between items-start mb-1">
                  <span class="font-bold text-slate-900 text-sm truncate pr-2">{{ nameOf(c) }}</span>
                  <span class="text-xs text-slate-400 whitespace-nowrap">{{ timeOf(c.updatedAt) }}</span>
                </div>
                <p class="text-sm text-slate-500 truncate pr-4">{{ previewOf(c) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat View -->
        <div class="flex-1 flex flex-col bg-slate-50/30 relative">
          <!-- Chat Header -->
          <div class="h-16 border-b border-slate-100 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">{{ activeChat ? nameOf(activeChat) : 'Select a conversation' }}</h3>
                <p class="text-sm text-slate-500">{{ activeChatId ? activeChatId : '' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Chat Messages -->
          <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6" id="chat-messages">
            <div v-if="loadingMessages" class="flex justify-center p-8">
              <Loader2 class="animate-spin text-brand-600 w-6 h-6" />
            </div>

            <!-- Empty state -->
            <div class="flex flex-col items-center justify-center h-full opacity-50" v-else-if="messages.length === 0">
              <MessageSquare class="w-12 h-12 text-slate-300 mb-4" />
              <p class="text-slate-500 font-medium">
                {{ activeChatId ? 'No messages in this conversation yet' : 'Select a conversation to start chatting' }}
              </p>
            </div>

            <!-- Messages List -->
            <div v-for="msg in messages" :key="msg._id" class="flex items-start gap-3" :class="{ 'flex-row-reverse': isMine(msg) }">
              <div v-if="!isMine(msg)" class="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>
              <div v-else class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                <span class="font-bold text-brand-600 text-sm">B.</span>
              </div>
              
              <div class="max-w-md shadow-sm" :class="isMine(msg) ? 'bg-brand-600 rounded-2xl rounded-tr-none p-4' : 'bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4'">
                
                <!-- Real attachment, rendered from the stored assetUrl only -->
                <div v-if="msg.type === 'image' && msg.assetUrl" class="mb-2 rounded-xl overflow-hidden">
                  <img :src="msg.assetUrl" class="w-full object-cover" :alt="msg.content || 'Chat attachment'">
                </div>

                <audio
                  v-else-if="msg.type === 'voice' && msg.assetUrl"
                  :src="msg.assetUrl"
                  controls
                  class="mb-2 w-48"
                ></audio>

                <p class="text-sm" :class="isMine(msg) ? 'text-white' : 'text-slate-700'">{{ msg.content }}</p>
                <span class="text-[10px] mt-2 block" :class="isMine(msg) ? 'text-brand-200 text-right' : 'text-slate-400'">{{ timeOf(msg.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="p-4 bg-white border-t border-slate-100 shrink-0">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <input v-model="newMessage" type="text" placeholder="Type your message to resolve the complain..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
              <button v-if="newMessage.trim()" type="submit" class="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                <Send class="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Loader2, MessageSquare, Send } from 'lucide-vue-next';
import { chatApi, type Chat, type ChatMessage } from '~/api_factory/modules/chat';
import { usersApi } from '~/api_factory/modules/users';

/**
 * This page was a static mockup: a fake conversation list (`v-for="i in 3"` with
 * "User 18472"), two hardcoded messages, and a composer that pushed into a local
 * array. Nothing was ever read from or written to the backend.
 *
 * It now uses the real chat API. Admins can only see conversations they are a
 * participant in — the backend enforces that on every read and write, which is
 * correct: this is a shared inbox, not a surveillance tool.
 */

definePageMeta({ layout: false });

const chats = ref<Chat[]>([]);
const messages = ref<ChatMessage[]>([]);
const activeChatId = ref('');
const loadingChats = ref(true);
const loadingMessages = ref(false);
const sending = ref(false);
const error = ref('');
const newMessage = ref('');
const searchQuery = ref('');

// The admin has no global user store, so the signed-in id is fetched outright.
// It is only needed to decide which side of the thread a message sits on.
const myId = ref('');

const activeChat = computed(() => chats.value.find((c) => c._id === activeChatId.value) || null);

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return chats.value;
  return chats.value.filter((c) => {
    const name = nameOf(c).toLowerCase();
    const preview = String(previewOf(c) || '').toLowerCase();
    return name.includes(q) || preview.includes(q);
  });
});

const otherParticipant = (c: Chat) =>
  (c.participants || []).find((p) => p && p._id !== myId.value) || (c.participants || [])[0];

const nameOf = (c: Chat) => {
  const p = otherParticipant(c);
  if (!p) return 'Conversation';
  const full = `${p.firstName || ''} ${p.lastName || ''}`.trim();
  return full || p.email || 'Conversation';
};

const previewOf = (c: Chat) => {
  const m = c.lastMessage;
  return typeof m === 'object' && m ? m.content : 'No messages yet';
};

const timeOf = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const isMine = (msg: ChatMessage) => {
  const senderId = typeof msg.sender === 'object' && msg.sender ? msg.sender._id : msg.sender;
  return senderId === myId.value;
};

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.getElementById('chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const openChat = async (c: Chat) => {
  activeChatId.value = c._id;
  loadingMessages.value = true;
  error.value = '';
  try {
    const { data } = await chatApi.getMessages(c._id);
    messages.value = Array.isArray(data) ? data : [];
    scrollToBottom();
  } catch (err: any) {
    error.value =
      err?.response?.status === 403
        ? 'You are not a participant in this conversation.'
        : err?.response?.status === 401
          ? 'Your session has expired — sign in again.'
          : 'Could not load this conversation.';
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
};

const sendMessage = async () => {
  const content = newMessage.value.trim();
  if (!content || !activeChatId.value || sending.value) return;
  sending.value = true;
  error.value = '';
  try {
    const { data } = await chatApi.sendMessage(activeChatId.value, { content });
    messages.value.push(data);
    newMessage.value = '';
    scrollToBottom();
  } catch (err: any) {
    // Keep the text so the admin does not lose what they typed.
    error.value = err?.response?.data?.message || 'Message could not be sent.';
  } finally {
    sending.value = false;
  }
};

const loadChats = async () => {
  loadingChats.value = true;
  error.value = '';
  try {
    const { data } = await chatApi.getChats();
    chats.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value =
      err?.response?.status === 401
        ? 'Your session has expired — sign in again.'
        : err?.response?.data?.message || 'Could not load conversations.';
    chats.value = [];
  } finally {
    loadingChats.value = false;
  }
};

const reload = async () => {
  await loadChats();
  if (activeChatId.value) {
    const current = chats.value.find((c) => c._id === activeChatId.value);
    if (current) await openChat(current);
  }
};

onMounted(() => {
  // Best-effort: without it every message renders on the left, which is cosmetic
  // and must not block the page.
  usersApi
    .getProfile()
    .then(({ data }) => { myId.value = data?._id || ''; })
    .catch(() => {});

  loadChats();
});
</script>
