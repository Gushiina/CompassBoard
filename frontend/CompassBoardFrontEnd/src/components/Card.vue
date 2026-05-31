<!-- src/components/Card.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../stores/board.ts'
import { useBoardStore } from '../stores/board.ts'

const props = defineProps<{ card: Card }>()
const store = useBoardStore()

const isEditing = ref(false)
const editText = ref('')
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 拖拽
const onHeaderDown = (e: MouseEvent) => {
    isDragging.value = true
    dragOffset.value = { x: e.clientX - props.card.x, y: e.clientY - props.card.y }

    const onMove = (ev: MouseEvent) => {
        store.moveCard(props.card.id, ev.clientX - dragOffset.value.x, ev.clientY - dragOffset.value.y)
    }
    const onUp = () => {
        isDragging.value = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
}

// 编辑
const startEdit = () => {
    if (props.card.type !== 'text') return
    editText.value = props.card.content
    isEditing.value = true
}
const finishEdit = () => {
    store.updateContent(props.card.id, editText.value)
    isEditing.value = false
}

// 粘贴
const onPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
        if (items[i]?.type.includes('image')) {
            const file = items[i]?.getAsFile()
            if (file) {
                store.setType(props.card.id, 'image')
                store.updateContent(props.card.id, URL.createObjectURL(file))
                return
            }
        }
    }

    const text = e.clipboardData?.getData('text')
    if (text && props.card.type === 'text') {
        store.updateContent(props.card.id, text)
    }
}
</script>

<<template>
    <div class="card" :style="{
        left: card.x + 'px',
        top: card.y + 'px',
        width: card.width + 'px',
        height: card.height + 'px'
    }">
        <div class="header" @mousedown="onHeaderDown">
            <span class="title">{{ card.type === 'image' ? '图片' : '便签' }}</span>
            <button class="del" @click.stop="store.removeCard(card.id)">×</button>
        </div>

        <div class="body" @dblclick="startEdit">
            <!-- 文本展示 -->
            <div v-if="card.type === 'text' && !isEditing" class="text-display">
                {{ card.content }}
            </div>

            <!-- 文本编辑 -->
            <textarea v-if="card.type === 'text' && isEditing" v-model="editText" class="text-edit" @blur="finishEdit"
                @keydown.enter.prevent="finishEdit" />

            <!-- 图片 -->
            <img v-if="card.type === 'image'" :src="card.content" class="img-display" draggable="false">
        </div>
    </div>
</template>

    <style scoped>
    .card {
        position: absolute;
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
    }

    .header {
        height: 36px;
        background: rgba(128, 128, 128, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        cursor: grab;
    }

    .header:active {
        cursor: grabbing;
    }

    .title {
        font-size: 12px;
        font-weight: 600;
        color: var(--text);
        opacity: 0.5;
    }

    .del {
        border: none;
        background: transparent;
        color: var(--text);
        opacity: 0.4;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
    }

    .del:hover {
        opacity: 1;
        color: #e53935;
    }

    .body {
        flex: 1;
        padding: 12px;
        overflow: hidden;
    }

    .text-display {
        color: var(--text);
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
        user-select: text;
    }

    .text-edit {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        color: var(--text);
        font-size: 14px;
        line-height: 1.6;
        resize: none;
        outline: none;
        font-family: inherit;
    }

    .img-display {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 4px;
        pointer-events: none;
    }
</style>