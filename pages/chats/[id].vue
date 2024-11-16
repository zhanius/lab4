<template>
  <div class="chat-container">
    <!-- Loading State -->
    <div v-if="!chat && !error" class="loading">
      <p>Loading chat...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error">
      <p>Error loading chat. Please try again later.</p>
    </div>

    <!-- Messages Section -->
    <div v-if="chat" class="messages-list">
      <div
        v-for="message in chat.messages"
        :key="message.id"
        :class="['message', { 'sent': message.sender_id === currentUserId, 'received': message.receiver_id === currentUserId }]"
      >
        <p class="message-content">{{ message.content }}</p>
        <small class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</small>
      </div>
    </div>

    <!-- Message Input Section -->
    <form @submit.prevent="sendMessage" class="message-input-container">
      <input
        v-model="newMessage"
        placeholder="Type your message..."
        class="message-input"
        required
      />
      <button type="submit" class="send-button">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Chat, Message } from "~/models";
import { useRoute } from 'vue-router';

export default defineComponent({
  name: "Chat",
  setup() {
    const route = useRoute();
    const chatId = route.params.id;
    const chat = ref<Chat | null>(null);
    const error = ref<Error | null>(null);
    const currentUserId = ref(1); // Replace with actual user ID if dynamic
    const newMessage = ref("");
    let pollingInterval: number | undefined;

    console.log(chatId)

    const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const fetchMessages = async () => {
      try {
        const response = await $fetch<Chat>(`${useRuntimeConfig().public.apiBase}/protected/chat/${+chatId}`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        chat.value = response;
        currentUserId.value = chat.value.sender_id;

        console.log()
      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching messages:", error.value);
      }
    };

    const startPolling = () => {
      pollingInterval = window.setInterval(fetchMessages, 1000);
    };

    const stopPolling = () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        const response = await $fetch<Message>(`${useRuntimeConfig().public.apiBase}/protected/send-message`, {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
          body: {
            receiver_id: chat.value.receiver_id,
            content: newMessage.value,
            chat_id: +chatId,
          },
        });

        console.log(chat.value.receiver_id, chat.value.sender_id, +chatId)

        chat.value?.messages.push(response);
        newMessage.value = "";
      } catch (err) {
        error.value = err as Error;
        console.error("Error sending message:", error.value);
      }
    };

    onMounted(() => {
      fetchMessages();
      startPolling();
    });

    onBeforeUnmount(stopPolling);

    return {
      chat,
      error,
      currentUserId,
      newMessage,
      formatTimestamp,
      sendMessage,
    };
  },
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: #f44336;
}

.messages-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.message {
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  max-width: 70%;
}

.message.sent {
  background-color: #d4f7d4;
  align-self: flex-end;
}

.message.received {
  background-color: #f1f1f1;
  align-self: flex-start;
}

.message-content {
  font-size: 16px;
  color: #333;
}

.message-timestamp {
  font-size: 12px;
  color: #888;
  text-align: right;
  display: block;
  margin-top: 4px;
}

.message-input-container {
  display: flex;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.send-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
