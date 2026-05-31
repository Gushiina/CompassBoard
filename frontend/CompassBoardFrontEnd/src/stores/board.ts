// src/stores/board.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CardType = 'text' | 'image'

export interface Card {
    id: string
    x: number
    y: number
    width: number
    height: number
    type: CardType
    content: string   // 文本直接存字，图片存 base64 或 blob URL
}

export const useBoardStore = defineStore('board', () => {
    const cards = ref<Card[]>([])

    const addCard = (
        x: number,
        y: number,
        type: CardType = 'text',
        content: string = '双击编辑'
    ) => {
        cards.value.push({
            id: crypto.randomUUID(),
            x, y,
            width: type === 'image' ? 300 : 260,
            height: type === 'image' ? 220 : 200,
            type,
            content
        })
    }

    const moveCard = (id: string, x: number, y: number) => {
        const c = cards.value.find(c => c.id === id)
        if (c) { c.x = x; c.y = y }
    }

    const updateContent = (id: string, content: string) => {
        const c = cards.value.find(c => c.id === id)
        if (c) c.content = content
    }

    const setType = (id: string, type: CardType) => {
        const c = cards.value.find(c => c.id === id)
        if (c) c.type = type
    }

    const removeCard = (id: string) => {
        cards.value = cards.value.filter(c => c.id !== id)
    }

    return { cards, addCard, moveCard, updateContent, setType, removeCard }
})