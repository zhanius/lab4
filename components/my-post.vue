<template>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Post } from "~/models"

export default defineComponent({
  name: "MyPost",
  setup() {
    const data = ref<Post[]>(null);
    const error = ref<Error | null>(null);
    const fetchTopics = async () => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/protected/posts`, {
          method: "GET",
          headers: {
            //"Authorization": localStorage.getItem('accessToken'),
            "Authorization": localStorage.getItem('accessToken'),
          },
        });
        data.value = response;
      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching topics:", error.value);
      }
    };

    onMounted(fetchTopics);

    return {
      data,
      error,
    };
  },
});
</script>

<style scoped>

</style>