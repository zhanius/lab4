<template>
  <div class="chats-container">
    <!-- Loading State -->
    <div v-if="!chats && !error" class="loading">
      <p>Loading chats...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error">
      <p>Error loading chats. Please try again later.</p>
    </div>

    <!-- Chats List -->
    <div v-if="chats" class="chats-list">
      <div v-for="chat in chats" :key="chat.ID" class="chat-item">
        <p class="chat-name">{{ chat.receiver.name }}</p>
        <small class="chat-timestamp">{{ formatTimestamp(chat.receiver.activity) }}</small>
        <router-link :to="`/chats/${chat.ID}`" class="view-chat">View</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Chats } from "~/models";

export default defineComponent({
  name: "ChatsPage",
  setup() {
    const chats = ref<Chats[] | null>(null);
    const error = ref<Error | null>(null);

    const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const fetchChats = async () => {
      try {
        const response = await $fetch<Chats[]>(`${useRuntimeConfig().public.apiBase}/protected/chats`, {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        });
        chats.value = response;
        for (let i in chats.value) {
            let idd = 0;
            if (chats.value[i].receiver_id == chats.value[i].my_id) {
                idd = chats.value[i].sender_id
            } else {
                idd = chats.value[i].receiver_id
            }
            const receiver = await $fetch<User>(`${useRuntimeConfig().public.apiBase}/users/${idd}`, {
              method: "GET",
            });
            chats.value[i].receiver = receiver;
          }
      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching chats:", error.value);
      }
    };

    onMounted(fetchChats);

    return {
      chats,
      error,
      formatTimestamp,
    };
  },
});
</script>

<style scoped>
.chats-container {
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

.chats-list {
  display: flex;
  flex-direction: column;
}

.chat-item {
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.chat-name {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.chat-last-message {
  font-size: 14px;
  color: #666;
}

.chat-timestamp {
  font-size: 12px;
  color: #888;
}

.view-chat {
  font-size: 14px;
  color: #4CAF50;
  text-decoration: none;
}
</style>
