<template>
  <div class="container">
    <!-- Login Form -->
    <div v-if="!data" class="auth-form">
      <h2>Login</h2>
      <form @submit.prevent="login({ username: username, password: password })">
        <div class="form-group">
          <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="input-field"
              required
          />
        </div>
        <div class="form-group">
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <p v-if="loginError" class="error">{{ loginError }}</p>

      <div class="register-link">
        <p>Don't have an account? <span @click="showRegisterForm = true" class="link">Register here</span></p>
      </div>
    </div>

    <!-- Register Form -->
    <div v-if="showRegisterForm" class="auth-form">
      <h2>Register</h2>
      <form @submit.prevent="register({ username: newUsername, password: newPassword, email: newEmail })">
        <div class="form-group">
          <input
              v-model="newUsername"
              type="text"
              placeholder="Username"
              class="input-field"
              required
          />
        </div>
        <div class="form-group">
          <input
              v-model="newEmail"
              type="email"
              placeholder="Email"
              class="input-field"
              required
          />
        </div>
        <div class="form-group">
          <input
              v-model="newPassword"
              type="password"
              placeholder="Password"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="btn">Register</button>
      </form>
      <p v-if="registerError" class="error">{{ registerError }}</p>

      <div class="login-link">
        <p>Already have an account? <span @click="showRegisterForm = false" class="link">Login here</span></p>
      </div>
    </div>

    <!-- Protected Content -->
    <div v-if="data" class="protected-content">
      <h2>Posts</h2>
      <div v-for="post in data" :key="post.id" class="post-card">
        <p>{{ post.content }}</p>
        <small>{{ post.timestamp }}</small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Post, Login, Register } from "~/models";

export default defineComponent({
  name: "Authorization",
  setup() {
    // Form data for login and registration
    const username = ref("");
    const password = ref("");
    const newUsername = ref("");
    const newPassword = ref("");
    const newEmail = ref("");

    // Error handling and status
    const loginError = ref<string | null>(null);
    const registerError = ref<string | null>(null);
    const showRegisterForm = ref(false);

    // Login function
    const login = async (loginData: Login) => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/login`, {
          method: "POST",
          body: loginData,
        });
        localStorage.setItem("accessToken", response.accessToken); // Store access token
        loginError.value = null; // Clear any previous errors
        fetchPosts(); // Fetch posts after successful login
      } catch (err) {
        loginError.value = "Login failed. Please check your credentials."; // Handle login error
        console.error("Login error:", err);
      }
    };

    // Register function
    const register = async (registerData: Register) => {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBase}/register`, {
          method: "POST",
          body: registerData,
        });
        registerError.value = null; // Clear any previous errors
        console.log("Registration successful", response);
        showRegisterForm.value = false; // Hide register form after success
      } catch (err) {
        registerError.value = "Registration failed. Please try again."; // Handle registration error
        console.error("Registration error:", err);
      }
    };

    return {
      username,
      password,
      newUsername,
      newPassword,
      newEmail,
      loginError,
      registerError,
      showRegisterForm,
      login,
      register,
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.auth-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.error {
  color: red;
  margin-top: 10px;
}

.link {
  color: #4CAF50;
  cursor: pointer;
}

.protected-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-card {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
