<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Post } from "~/models";

export default defineComponent({
  name: "MyPost",
  setup() {
    const data = ref<Post[]>(null);
    const error = ref<Error | null>(null);

    // Format the timestamp to a readable format
    const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    // Fetch posts with authorization header
    const fetchTopics = async () => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/protected/posts`, {
          method: "GET",
          headers: {
            "Authorization": `${localStorage.getItem('accessToken')}`,
          },
        });
        data.value = response;
      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching posts:", error.value);
      }
    };

    onMounted(fetchTopics);

    return {
      data,
      error,
      formatTimestamp,
    };
  },
});
</script>

<template>
  <div class="container">
    <div v-if="!data && !error" class="loading">
      {{console.log(data, error)}}
      <p>Loading posts...</p>
    </div>

    <div v-if="error" class="error">
      <p>Error loading posts. Please try again later.</p>
    </div>

    <div v-if="data" class="posts-list">
      <h2 class="section-title">My Posts</h2>
      <div v-for="post in data" :key="post.id" class="post-card">
        <div class="post-content">
          <p class="post-text">{{ post.content }}</p>
          <small class="post-timestamp">{{ formatTimestamp(post.timestamp) }}</small>
        </div>
        <div class="post-footer">
          <span class="post-rating">Rating: {{ post.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: #f44336;
}

.posts-list {
  margin-top: 20px;
}

.section-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.post-card {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-content {
  margin-bottom: 10px;
}

.post-text {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.post-timestamp {
  font-size: 12px;
  color: #888;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}

.post-likes,
.post-rating {
  color: #4CAF50;
}

.post-footer span {
  font-weight: bold;
}
</style>
