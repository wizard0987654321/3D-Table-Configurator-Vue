<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRegistering = ref(false);
const username = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
    error.value = '';
    const endpoint = isRegistering.value ? '/api/register' : '/api/login';
    
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
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
            router.push('/about');
        }
    } catch (err) {
        error.value = err.message;
    }
};
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="auth-title">Konfigurator</h1>
            <h3 class="auth-subtitle">{{ isRegistering ? 'Konto erstellen' : 'Anmelden' }}</h3>
            
            <form @submit.prevent="handleSubmit" class="auth-form">
                <input v-model="username" type="text" placeholder="Benutzername" required class="auth-input">
                <input v-model="password" type="password" placeholder="Passwort" required class="auth-input">
                <div v-if="error" class="auth-error">{{ error }}</div>
                <button type="submit" class="auth-button">
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