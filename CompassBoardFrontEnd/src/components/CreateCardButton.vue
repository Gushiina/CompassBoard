<script setup lang="ts">
import { useBoardStore } from '../stores/board'

const store = useBoardStore()

const createCard = () => {
    const cx = window.innerWidth / 2 - 130   // 卡片宽 260，居中偏左一半
    const cy = window.innerHeight / 2 - 100  // 卡片高 200，居中偏上一半
    store.addCard(cx, cy)
}
</script>

<<template>
    <button class="create-btn" @click="createCard" title="新建便签">
        ＋
    </button>
</template>

    <style scoped>
    .create-btn {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        background: var(--card-bg);
        color: var(--text);
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease;
    }

    .create-btn:hover {
        transform: scale(1.1);
    }
</style>