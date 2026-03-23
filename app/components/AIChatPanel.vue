<template>
  <div class="chat-wrapper">
    <!-- Floating toggle button -->
    <button class="chat-fab" :class="{ active: isOpen }" @click="toggleChat">
      <span v-if="!isOpen">💬</span>
      <span v-else>✕</span>
    </button>

    <!-- Chat panel -->
    <Teleport to="body">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-header">
          <span class="chat-title">🤖 旅行助手</span>
          <button class="chat-close" @click="isOpen = false">✕</button>
        </div>

        <div ref="messagesRef" class="chat-messages">
          <!-- Welcome message -->
          <div v-if="chatMessages.length === 0" class="chat-welcome">
            <div class="welcome-icon">🌍</div>
            <p>你好！我是你的 AI 旅行助手</p>
            <span>问我任何旅行问题，比如签证、交通、美食、住宿...</span>
            <div class="quick-questions">
              <button v-for="q in quickQuestions" :key="q" @click="sendMessage(q)">
                {{ q }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, i) in chatMessages"
            :key="i"
            class="chat-msg"
            :class="msg.role"
          >
            <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
            <div class="msg-content">
              <div v-if="msg.role === 'assistant'" class="msg-text" v-html="renderMarkdown(msg.content)" />
              <div v-else class="msg-text">{{ msg.content }}</div>
            </div>
          </div>

          <!-- Streaming indicator -->
          <div v-if="isStreaming" class="chat-msg assistant">
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
              <div class="msg-text">
                <span v-if="streamingText" v-html="renderMarkdown(streamingText)" />
                <span v-else class="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="chatError" class="chat-error">
          {{ chatError }}
        </div>

        <div class="chat-input-area">
          <input
            v-model="inputText"
            type="text"
            placeholder="输入你的问题..."
            :disabled="isStreaming"
            @keydown.enter="handleSend"
          />
          <button
            class="send-btn"
            :disabled="!inputText.trim() || isStreaming"
            @click="handleSend"
          >
            {{ isStreaming ? '⏳' : '➤' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { AIChatMessage } from '~/types'

const props = defineProps<{
  country?: string
  city?: string
}>()

const isOpen = ref(false)
const inputText = ref('')
const chatMessages = ref<AIChatMessage[]>([])
const isStreaming = ref(false)
const streamingText = ref('')
const chatError = ref('')
const messagesRef = ref<HTMLElement>()
let abortFn: (() => void) | null = null

const quickQuestions = computed(() => {
  const qs = []
  if (props.country) {
    qs.push(`${props.country}有什么必吃美食？`)
    qs.push(`${props.country}需要注意什么？`)
  }
  if (props.city) {
    qs.push(`${props.city}怎么坐地铁？`)
  }
  if (qs.length === 0) {
    qs.push('第一次出国旅行要准备什么？')
    qs.push('有哪些免签国家推荐？')
    qs.push('旅行预算怎么规划？')
  }
  return qs.slice(0, 3)
})

function toggleChat() {
  isOpen.value = !isOpen.value
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return
  sendMessage(text)
  inputText.value = ''
}

async function sendMessage(text: string) {
  const { checkConfigured, chat } = useAI()

  const configured = await checkConfigured()
  if (!configured) {
    chatError.value = '请先在设置页面配置 AI'
    return
  }

  chatError.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  isStreaming.value = true
  streamingText.value = ''

  scrollToBottom()

  const messages = chatMessages.value.map(m => ({
    role: m.role,
    content: m.content,
  }))

  const { abort } = chat(
    messages,
    { country: props.country, city: props.city },
    (chunk) => {
      streamingText.value += chunk
      scrollToBottom()
    },
    (fullText) => {
      chatMessages.value.push({ role: 'assistant', content: fullText })
      isStreaming.value = false
      streamingText.value = ''
      scrollToBottom()
    },
    (err) => {
      isStreaming.value = false
      streamingText.value = ''
      chatError.value = err
    },
  )

  abortFn = abort
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

onBeforeUnmount(() => {
  abortFn?.()
})

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, ' ')
}
</script>

<style scoped>
.chat-wrapper {
  position: relative;
  z-index: 999;
}

/* FAB */
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}
.chat-fab:hover {
  transform: scale(1.1);
}
.chat-fab.active {
  background: var(--border);
  font-size: 18px;
}

/* Panel */
.chat-panel {
  position: fixed;
  bottom: 88px;
  right: 24px;
  width: 380px;
  max-width: calc(100vw - 32px);
  height: 520px;
  max-height: calc(100vh - 120px);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
}
.chat-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
}
.chat-close {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-welcome {
  text-align: center;
  padding: 24px 16px;
}
.welcome-icon {
  font-size: 36px;
  margin-bottom: 8px;
}
.chat-welcome p {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.chat-welcome span {
  font-size: 12px;
  color: var(--muted);
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
.quick-questions button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.quick-questions button:hover {
  border-color: var(--accent);
  background: rgba(74, 158, 255, 0.05);
}

.chat-msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.chat-msg.user {
  flex-direction: row-reverse;
}
.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.msg-content {
  max-width: 80%;
}
.msg-text {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
}
.chat-msg.user .msg-text {
  background: var(--accent);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-msg.assistant .msg-text {
  background: var(--bg2);
  color: var(--text);
  border-bottom-left-radius: 4px;
}
.msg-text :deep(strong) {
  color: inherit;
  font-weight: 700;
}
.msg-text :deep(ul) {
  margin: 4px 0;
  padding-left: 16px;
}
.msg-text :deep(li) {
  margin-bottom: 2px;
}

/* Typing dots */
.typing-dots {
  display: inline-flex;
  gap: 4px;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  animation: typingBounce 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

/* Error */
.chat-error {
  padding: 8px 12px;
  background: rgba(214, 48, 49, 0.1);
  color: var(--red);
  font-size: 12px;
  text-align: center;
}

/* Input */
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg2);
}
.chat-input-area input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  outline: none;
}
.chat-input-area input:focus {
  border-color: var(--accent);
}
.chat-input-area input::placeholder {
  color: var(--muted);
}
.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .chat-panel {
    bottom: 80px;
    right: 12px;
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
  }
  .chat-fab {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
