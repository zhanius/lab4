<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Topic } from "~/models"

export default defineComponent({
  name: "Header",
  setup() {
    const menuOpen = ref(false);
    const menuRef = ref<HTMLElement | null>(null);
    const data = ref<Topic[]>(null);
    const error = ref<Error | null>(null);
    const selectedBlogName = ref("Adventure");
    const userMenu = ref(false);


    const fetchTopics = async () => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/topics`, {
          method: "GET",
        });
        data.value = response;
      } catch (err) {
        error.value = err as Error;
        console.error("Error fetching topics:", error.value);
      }
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
      if (menuRef.value) {
        menuRef.value.style.left = menuOpen.value ? "-2px" : "-400px";
      }
    };

    const selectBlog = (blogName) => {
      selectedBlogName.value = blogName;
      menuOpen.value = false;
      menuRef.value.style.left = "-400px";

    }

    const toggleUserIcon = () => {
      userMenu.value = !userMenu.value;
    }

    const closeMenu = () => {
      menuOpen.value = false;
      menuRef.value.style.left = "-400px";
    }

    onMounted(fetchTopics);

    return {
      menuOpen,
      data,
      error,
      menuRef,
      closeMenu,
      toggleMenu,
      selectBlog,
      selectedBlogName,
      userMenu,
      toggleUserIcon,
    };
  },
});
</script>

<template>
  <div>
    <div class="overlay" v-show="menuOpen" @click="closeMenu"></div>

    <nav
        ref="menuRef"
        class="fixed top-0 left-[-400px] h-screen w-full max-w-sm bg-gradient-to-tr from-lime-200 to-lime-600 text-white transition-all duration-300 ease-in-out z-30 border-x-2 border-black/50"
    >
      <ul class="flex flex-col items-center justify-center p-26 text-2xl gap-1 mt-[50px]">
        <NuxtLink to="/reviews" class="font-black text-black text-4xl">Menu</NuxtLink>
        <div class="flex flex-col items-center justify-center p-20 gap-3 text-3xl font-bold text-black">
          <li @click="selectBlog(topic.name)" :class="{ active: selectedBlogName === topic.name }" v-for="topic in data" :key="topic"><a class="hover:text-indigo-400">{{topic.name}}</a></li>
        </div>
        <div>

        </div>
        <div class="contacts w-[280px] text-black font-bold">
          <h1>Contacts</h1>
          <h3>PHONE: +1(234)-23-45-22</h3>
          <h3>ADDRESS: Green st., Yalow park</h3>
          <h3>EMAIL: Yallow@park.info</h3>
        </div>
      </ul>
    </nav>

    <div class="absolute top-[50px] right-[10px] bg-yellow-200 border border-black rounded-lg p-2 w-[150px] text-center z-[1001] shadow-lg transition-all duration-300 ease-in-out"
           v-show="userMenu" @click="toggleUserIcon">
      <Nuxtlink to="/profile">My Profile</Nuxtlink>
      <Nuxtlink to="/favorites">Favorites</Nuxtlink>
    </div>

    <div class="userIcon-menu" v-show="userMenu">
    </div>

    <div
        class="bg-gradient-to-r from-lime-50 to-lime-100 w-full h-[80px] flex justify-evenly items-center"
    >
      <button
          class="rounded-[100%] bg-gradient-to-r from-lime-400 to-lime-200"
          @click="toggleMenu"
          :aria-expanded="menuOpen.toString()"
      >
        <img class="w-[70px] p-3" src="../assets/icons/menu.png" />
      </button>
      <div id="title" class="bg-gradient-to-r from-lime-400 to-lime-200 rounded-3xl">
        New trips on Fall season! Full details on our Instagram accounts.
      </div>
      <button @click="toggleUserIcon">
        <img
            class="rounded-[100%] bg-gradient-to-r from-lime-400 to-lime-200 w-[70px] p-3"
            src="../assets/icons/user.png"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cookie&display=swap");

#title {
  padding: 0 240px;
  font-size: 40px;
  font-family: "Cookie", cursive;
  font-weight: 400;
  font-style: normal;
}

.overlay{
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.active{
  color: darkslateblue;
}
</style>
