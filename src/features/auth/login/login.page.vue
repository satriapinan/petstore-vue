<script setup lang="ts">
import { useAuth } from '@core/services/composables/useAuth';
import Button from '@shared/components/button/button.component.vue';
import Card from '@shared/components/card/card.component.vue';
import Textfield from '@shared/components/textfield/textfield.component.vue';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const { login, isLoginPending } = useAuth();

const username = ref('');
const password = ref('');
const submitError = ref<string | null>(null);

const isValid = computed(() => !!username.value.trim() && !!password.value.trim());

const onSubmit = async () => {
  submitError.value = null;
  try {
    await login({ username: username.value, password: password.value });
  } catch {
    submitError.value = 'Invalid username or password';
  }
};
</script>

<template>
  <div class="login-container">
    <Card
      min-width="30vw"
      :custom-style="{ display: 'flex', flexDirection: 'column', gap: '16px' }"
    >
      <div class="content-container">
        <p class="login-subtitle">Please enter your details</p>
        <h2 class="login-title">Welcome Back!</h2>
      </div>

      <form class="form-container" novalidate @submit.prevent="onSubmit">
        <div class="content-container">
          <Textfield label="Username" :value="username" @change="username = $event" />

          <Textfield
            label="Password"
            type="password"
            :value="password"
            @change="password = $event"
          />

          <p v-if="submitError" class="error">{{ submitError }}</p>
        </div>

        <Button
          label="Sign In"
          type="submit"
          variant="contained"
          full-width
          :loading="isLoginPending"
          :disabled="!isValid || isLoginPending"
          font-size="16px"
          font-weight="500"
          padding="14px 20px"
        />
      </form>

      <p class="register-link">
        Don't have an account? <RouterLink to="/register">Sign up</RouterLink>
      </p>
    </Card>
  </div>
</template>

<style scoped src="./login.page.css" />
