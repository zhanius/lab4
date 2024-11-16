<template>
  <div class="bg-gradient-to-r from-lime-300 to-lime-600 w-full min-h-screen">
    <!-- Loading State -->
    <div v-if="!user && !error" class="loading">
      <p>Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error">
      <p>Error loading profile. Please try again later.</p>
    </div>

    <!-- Profile Section -->
    <div v-if="user" class="profile-card">
      <h2 class="profile-name">{{ user.name }}</h2>
      <p class="profile-email">{{ user.email }}</p>
      <p class="profile-location">Location: {{ user.location }}</p>
      <p class="profile-age">Age: {{ user.age }}</p>
      <p class="profile-rating">Rating: {{ user.rating }}</p>
      <p class="profile-activity">Activity: {{ user.activity }}</p>
      <div class="profile-friends">
        <h3>Friends</h3>
        <ul>
          <li v-for="friend in friends" :key="friends">
            Friend ID: {{ friend.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { User } from "~/models";

export default defineComponent({
  name: "MyProfile",
  setup() {
    const user = ref<User | null>(null);
    const error = ref<Error | null>(null);
    const friends = ref<User[]>([]);

    const fetchProfile = async () => {
      try {
        const response = await $fetch<User>(`${useRuntimeConfig().public.apiBase}/protected/me`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        user.value = response;

        if (user.value.friends) {
          for (let i in user.value.friends) {
            const friend = await $fetch<User>(`${useRuntimeConfig().public.apiBase}/users/${user.value.friends[i]}`, {
              method: "GET",
            });
            friends.value.push(friend);
          }
        }

        console.log(friends.value)

      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching profile:", error.value);
      }
    };

    onMounted(fetchProfile);

    return {
      user,
      friends,
      error,
    };
  },
});
</script>

<style scoped>
.container {
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

.profile-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.profile-email,
.profile-location,
.profile-age,
.profile-rating,
.profile-activity {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

.profile-friends {
  margin-top: 20px;
}

.profile-friends h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.profile-friends ul {
  list-style-type: disc;
  padding-left: 20px;
}

.profile-friends li {
  font-size: 16px;
  color: #444;
}
</style>
