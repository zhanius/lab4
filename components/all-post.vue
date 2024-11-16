<template>
  <div class="container ">
    <!-- Loading State -->
    <div v-if="!data && !error" class="loading">
      <p>Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error">
      <p>Error loading posts. Please try again later.</p>
    </div>

    <!-- Posts Section -->
    <div v-if="data" class="posts-list grid grid-cols-2 grid-rows-2 gap-[70px] px-40 py-20">
      <div v-for="post in data" :key="post.id" class="post-card w-[550px] rounded-3xl border-2 border-black bg-amber-50 px-10 py-5">
        <div class="flex flex-row items-center justify-between">
          <div class="bg-amber-100/80 rounded-lg shadow-sm p-2 flex-col inline-flex font-bold">
            {{ post.user.name }}
            <small class="post-timestamp font-medium mt-5">{{ formatTimestamp(post.timestamp) }}</small>
          </div>

          <div class="post-footer flex flex-col justify-center items-center">
            <span class="post-rating flex flex-col w-[50px]">Rating</span>
            <div class="flex flex-row items-center justify-between gap-2">
              <span v-for="star in post.rating" :key="star"><img class="w-[20px]" src="../assets/icons/yellow-star.png"></span>
              <span v-for="star in 5-post.rating"><img class="w-[20px]" src="../assets/icons/empty-star.png"></span>
            </div>
          </div>
          <div>
            <img class="w-[75px]" src="https://freesvg.org/img/abstract-user-flat-3.png">
          </div>
        </div>
        <div class="post-content flex flex-row items-center">
          <p class="post-text p-3 w-[400px]">{{ post.content }}</p>
          <button id="like" class="p-2 bg-green-800 text-white rounded-lg px-4" @click="toggleLike(post)">like</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {Post, User} from "~/models";

export default defineComponent({
  name: "MyPost",
  setup() {
    const data = ref<Post[]>(null);
    const error = ref<Error | null>(null);
    const author = ref<User | null>(null);
    const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const toggleLike = (post) => {
      post.like = !post.like;
      const like = document.getElementById('like');
      like.style.backgroundColor = post.like ? "red" : "green";
      like.textContent = post.like ? "dislike" : "like";
      post.rating = post.like ? post.rating+=1 : post.rating-=1;
    };
    // Fetch posts with authorization header
    const fetchTopics = async () => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/posts`, {
          method: "GET",
        });
        data.value = response;
        for(let i=0; i < data.value.length; i++) {
          const authorResponse = await $fetch<User>(`${useRuntimeConfig().public.apiBase}/users/${data.value[i].user_id}`, {
            method: "GET",
          });
          author.value = authorResponse;
          data.value[i].user=author.value;
          console.log(data.value)
        }
        console.log(data.value);
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
      toggleLike
    };
  },
});
</script>

<style scoped>

</style>
