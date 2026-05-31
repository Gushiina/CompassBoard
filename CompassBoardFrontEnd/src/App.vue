<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import './components/SwitchTheme.vue'
import SwitchTheme from './components/SwitchTheme.vue'
import CreateCardButton from './components/CreateCardButton.vue'
import { useBoardStore } from './stores/board.ts'
import Card from './components/Card.vue'
import type { CardType } from './stores/board'

const store = useBoardStore()

// 记录鼠标最后位置，用于 Ctrl+V 时知道贴在哪
const lastMousePos = ref({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

const onMouseMove = (e: MouseEvent) => {
    lastMousePos.value = { x: e.clientX, y: e.clientY }
}

// 双击空白处：始终创建默认空文本节点
const onBoardDoubleClick = (e: MouseEvent) => {
    if (e.target !== e.currentTarget) return
    store.addCard(e.clientX - 130, e.clientY - 20)
}

// Ctrl+V 在看板上：根据剪贴板内容创建节点
const onBoardPaste = (e: ClipboardEvent) => {
    // 如果当前在编辑框里，完全不碰，让浏览器自己处理文本粘贴
    const active = document.activeElement
    if (active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement) {
        return
    }

    const items = e.clipboardData?.items
    if (!items) return

    e.preventDefault()

    // 先找图片
    for (let i = 0; i < items.length; i++) {
        if (items[i]?.type.includes('image')) {
            const file = items[i]?.getAsFile()
            if (file) {
                store.addCard(
                    lastMousePos.value.x - 150,
                    lastMousePos.value.y - 110,
                    'image',
                    URL.createObjectURL(file)
                )
                return
            }
        }
    }

    // 再找文本
    const text = e.clipboardData?.getData('text')
    if (text?.trim()) {
        store.addCard(
            lastMousePos.value.x - 130,
            lastMousePos.value.y - 100,
            'text',
            text
        )
    }
}

onMounted(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('paste', onBoardPaste)
})

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('paste', onBoardPaste)
})

</script>

<template>
    <SwitchTheme></SwitchTheme>
    <div class="board" @dblclick="onBoardDoubleClick">
        <Card v-for="card in store.cards" :key="card.id" :card="card" />
        <CreateCardButton />
    </div>
</template>

<style scoped></style>
