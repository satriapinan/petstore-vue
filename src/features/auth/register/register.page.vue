<script setup lang="ts">
import { useAuth } from '@core/services/composables/useAuth';
import Button from '@shared/components/button/button.component.vue';
import Card from '@shared/components/card/card.component.vue';
import Textfield from '@shared/components/textfield/textfield.component.vue';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const { register: registerUser, isRegisterPending } = useAuth();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const submitError = ref<string | null>(null);
const passwordMismatch = ref(false);

const isValid = computed(
  () => !!username.value.trim() && !!password.value.trim() && !!confirmPassword.value.trim(),
);

const onSubmit = async () => {
  submitError.value = null;
  passwordMismatch.value = false;

  if (password.value !== confirmPassword.value) {
    passwordMismatch.value = true;
    return;
  }

  try {
    await registerUser({ username: username.value, password: password.value });
  } catch {
    submitError.value = 'Registration failed. Please try again.';
  }
};
</script>

<template>
  <div class="register-container">
    <Card
      min-width="30vw"
      :custom-style="{ display: 'flex', flexDirection: 'column', gap: '16px' }"
    >
      <div class="content-container">
        <p class="register-subtitle">Create your account</p>
        <h2 class="register-title">Get Started!</h2>
      </div>

      <form class="form-container" @submit.prevent="onSubmit">
        <div class="content-container">
          <Textfield label="Username" :value="username" @change="username = $event" />

          <Textfield
            label="Password"
            type="password"
            :value="password"
            @change="password = $event"
          />

          <Textfield
            label="Confirm Password"
            type="password"
            :value="confirmPassword"
            @change="confirmPassword = $event"
          />

          <p v-if="passwordMismatch" class="error">Passwords do not match</p>
          <p v-if="submitError" class="error">{{ submitError }}</p>
        </div>

        <Button
          label="Sign Up"
          type="submit"
          variant="contained"
          full-width
          :loading="isRegisterPending"
          :disabled="!isValid || isRegisterPending"
          font-size="16px"
          font-weight="500"
          padding="14px 20px"
        />
      </form>

      <p class="login-link">
        Already have an account? <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </Card>
  </div>
</template>

<style scoped src="./register.page.css" />
