<template>
  <div class="h-screen w-full flex flex-col bg-slate-50 relative">
    <div class="flex items-center justify-between shrink-0 p-6 border-b border-slate-200 bg-white">
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Support & Complain Handling (Chat)</h2>
          <p class="text-sm text-slate-500 mt-1">Aggressive WebSocket integrated notification & chat management.</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="flex h-3 w-3 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span class="text-sm font-semibold text-emerald-600">WebSocket Connected</span>
      </div>
    </div>

    <!-- Chat Classification Tabs -->
    <div class="bg-white flex-1 flex flex-col overflow-hidden">
      <div class="border-b border-slate-100 bg-slate-50/50 px-4 flex gap-4 shrink-0">
        <button v-for="tab in ['Sellers', 'Buyers', 'Swapping']" :key="tab" 
                @click="activeTab = tab"
                class="px-4 py-4 text-sm font-bold border-b-2 transition-colors relative"
                :class="activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'">
          {{ tab }} Complaints
          <span v-if="tab === 'Sellers'" class="absolute top-3 right-0 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">3</span>
        </button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar (Chat List) -->
        <div class="w-80 border-r border-slate-100 flex flex-col bg-white">
          <div class="p-4 border-b border-slate-100">
            <input type="text" placeholder="Search conversations..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500">
          </div>
          <div class="flex-1 overflow-y-auto">
            <!-- Loading State for Chats -->
            <div v-if="loadingChats" class="flex justify-center p-8">
              <Loader2 class="animate-spin text-brand-600 w-6 h-6" />
            </div>
            
            <div v-else class="divide-y divide-slate-100">
              <div v-for="i in 3" :key="i" class="p-4 hover:bg-slate-50 cursor-pointer transition-colors relative" :class="{'bg-brand-50/50': i === 1}">
                <div class="flex justify-between items-start mb-1">
                  <span class="font-bold text-slate-900 text-sm">User {{ i }}8472</span>
                  <span class="text-xs text-slate-400">10:4{{ i }} AM</span>
                </div>
                <p class="text-xs text-slate-500 truncate pr-4">I have an issue with the recent {{ activeTab.toLowerCase() }} transaction. Please help!</p>
                <div v-if="i === 1" class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat View -->
        <div class="flex-1 flex flex-col bg-slate-50/30 relative">
          <!-- Chat Header -->
          <div class="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">User 18472</h3>
                <p class="text-xs text-slate-500">Active now</p>
              </div>
            </div>
            <button class="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">Resolve Ticket</button>
          </div>
          
          <!-- Chat Messages -->
          <div class="flex-1 p-6 overflow-y-auto space-y-6" id="chat-messages">
            <!-- Empty state mockup for demo -->
            <div class="flex flex-col items-center justify-center h-full opacity-50" v-if="messages.length === 0">
              <MessageSquare class="w-12 h-12 text-slate-300 mb-4" />
              <p class="text-slate-500 font-medium">Select a conversation to start chatting</p>
            </div>

            <!-- Messages List -->
            <div v-for="msg in messages" :key="msg.id" class="flex items-start gap-3" :class="{'flex-row-reverse': msg.isMine}">
              <div v-if="!msg.isMine" class="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>
              <div v-else class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                <span class="font-bold text-brand-600 text-xs">B.</span>
              </div>
              
              <div class="max-w-md shadow-sm" :class="msg.isMine ? 'bg-brand-600 rounded-2xl rounded-tr-none p-4' : 'bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4'">
                
                <!-- If Message has an image attached -->
                <div v-if="msg.image" class="mb-2 rounded-xl overflow-hidden">
                  <img :src="msg.image" class="w-full object-cover">
                </div>
                
                <!-- If Message has a voice note -->
                <div v-if="msg.isVoice" class="flex items-center gap-2 mb-2 w-48 bg-black/10 p-2 rounded-lg" :class="msg.isMine ? 'text-white' : 'text-slate-700'">
                  <Play class="w-5 h-5 cursor-pointer hover:opacity-70" />
                  <div class="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div class="h-full bg-white/80 w-1/3"></div>
                  </div>
                  <span class="text-xs">0:14</span>
                </div>

                <p class="text-sm" :class="msg.isMine ? 'text-white' : 'text-slate-700'">{{ msg.text }}</p>
                <span class="text-[10px] mt-2 block" :class="msg.isMine ? 'text-brand-200 text-right' : 'text-slate-400'">{{ msg.time }}</span>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="p-4 bg-white border-t border-slate-100 shrink-0">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <button type="button" @click="mockUpload('image')" class="p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors" title="Upload Image/Asset">
                <Paperclip class="w-5 h-5" />
              </button>
              <input v-model="newMessage" type="text" placeholder="Type your message to resolve the complain..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
              <button v-if="newMessage.trim()" type="submit" class="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                <Send class="w-5 h-5" />
              </button>
              <button v-else type="button" @click="mockUpload('voice')" class="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm" title="Send Voice Note">
                <Mic class="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { Loader2, MessageSquare, Send, Paperclip, ArrowLeft, Mic, Play } from 'lucide-vue-next';

definePageMeta({
  layout: false
});

const activeTab = ref('Sellers');
const loadingChats = ref(true);

const newMessage = ref('');
const messages = ref([
  { id: 1, text: "Hello, I have an issue with the recent transaction. Please help!", isMine: false, time: "10:41 AM" },
  { id: 2, text: "Hello! Admin here. I can see the transaction. Give me a moment to review the escrow state.", isMine: true, time: "10:45 AM" }
]);

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.getElementById('chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  messages.value.push({
    id: Date.now(),
    text: newMessage.value.trim(),
    isMine: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  newMessage.value = '';
  scrollToBottom();
};

const mockUpload = (type: 'image' | 'voice') => {
  messages.value.push({
    id: Date.now(),
    text: type === 'image' ? "Sent an attachment" : "",
    image: type === 'image' ? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop" : undefined,
    isVoice: type === 'voice',
    isMine: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  scrollToBottom();
};

watch(activeTab, () => {
  // Mock switching conversation
  messages.value = [
    { id: 1, text: `I need help with my ${activeTab.value.toLowerCase()} transaction.`, isMine: false, time: "09:00 AM" }
  ];
});

onMounted(() => {
  // Mock loading for websocket connection initialization
  setTimeout(() => {
    loadingChats.value = false;
  }, 1000);
});
</script>
