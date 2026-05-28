<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLoading from '../components/AuthLoading.vue';

const router = useRouter();
const isRegistering = ref(false);
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;
  const endpoint = isRegistering.value ? '/api/register' : '/api/login';
    
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Fehler beim Authentifizieren');

    if (isRegistering.value) {
      alert("Erfolgreich registriert! Du kannst dich jetzt anmelden.");
      isRegistering.value = false;
      username.value = '';
      password.value = '';
    } else {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id);
      router.push('/scene');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="auth-title">Konfigurator</h1>
            <h3 class="auth-subtitle">{{ isRegistering ? 'Konto erstellen' : 'Anmelden' }}</h3>
            
            <form @submit.prevent="handleSubmit" class="auth-form" :aria-busy="isLoading">
              <input v-model="username" type="text" placeholder="Benutzername" required class="auth-input" :disabled="isLoading">
              <input v-model="password" type="password" placeholder="Passwort" required class="auth-input" :disabled="isLoading">
              <div v-if="error" class="auth-error">{{ error }}</div>
              <AuthLoading v-if="isLoading" />
              <button type="submit" class="auth-button" :disabled="isLoading">
                    {{ isRegistering ? 'Registrieren' : 'Anmelden' }}
                </button>
            </form>

            <p class="auth-toggle-text">
                {{ isRegistering ? 'Schon ein Konto?' : 'Noch kein Konto?' }}
                <span @click="isRegistering = !isRegistering" class="auth-toggle-link">
                    {{ isRegistering ? 'Hier anmelden' : 'Hier registrieren' }}
                </span>
            </p>
        </div>
    </div>
</template>

<style scoped>
    .auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: #021526;
  padding: 1rem;
  box-sizing: border-box;
}

.auth-card {
  background: #03346E;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  text-align: center;
}

.auth-title {
  color: #FFFFFF;
  font-size: 1.6rem;
  margin: 0 0 0.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.auth-subtitle {
  color: #6EACDA;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0.5rem 0 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(110, 172, 218, 0.12);
  color: #FFFFFF;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.auth-input::placeholder {
  color: rgba(226, 226, 182, 0.5);
}

.auth-input:focus {
  border-color: #6EACDA;
  background: rgba(110, 172, 218, 0.2);
}

.auth-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-error {
  color: #ff6b6b;
  font-size: 0.85rem;
  background: rgba(255, 107, 107, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.auth-button {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: #6EACDA;
  color: #021526;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 0.25rem;
}

.auth-button:hover {
  background: #FFFFFF;
}

.auth-button:active {
  transform: scale(0.98);
}

.auth-button:disabled {
  background: rgba(110, 172, 218, 0.6);
  cursor: not-allowed;
  transform: none;
}

.auth-toggle-text {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: rgba(226, 226, 182, 0.7);
}

.auth-toggle-link {
  color: #6EACDA;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-toggle-link:hover {
  color: #FFFFFF;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }

  .auth-title {
    font-size: 1.3rem;
  }
}

</style>