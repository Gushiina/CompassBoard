<!-- src/components/ThemeToggle.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(true)

const toggle = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}
</script>

<<template>
  <button class="theme-toggle" @click="toggle">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 9999;
  background: var(--card-bg);
  color: var(--text);
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  border-color: var(--text);
}
</style>