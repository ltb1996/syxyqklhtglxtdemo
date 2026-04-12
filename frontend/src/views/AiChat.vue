<template>
  <div class="page-container">
    <div class="chat-wrapper">
      <!-- Main Chat Area -->
      <div class="chat-main-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-info">
            <div class="header-icon">
              <el-icon>
                <ChatDotRound />
              </el-icon>
            </div>
            <div>
              <h1 class="page-title">AI 数据助手</h1>
              <p class="page-subtitle">基于学生真实数据的智能分析与问答</p>
            </div>
          </div>
          <el-button class="clear-btn" @click="clearChat" :disabled="messages.length === 0" plain>
            <el-icon>
              <Delete />
            </el-icon>清空对话
          </el-button>
        </div>

        <!-- Chat Thread -->
        <div class="chat-thread-container">
          <div class="chat-thread" ref="messagesRef">
            <!-- Welcome Screen -->
            <div v-if="messages.length === 0" class="welcome-view">
              <div class="welcome-hero">
                <div class="hero-icon-wrapper">
                  <el-icon class="hero-icon">
                    <ChatDotRound />
                  </el-icon>
                </div>
                <h2 class="hero-title">你好，{{ userInfo?.name || '管理员' }}</h2>
                <p class="hero-desc">我是你的智能数据助手。你可以直接向我询问关于学生档案、成绩、奖学金等方面的问题。</p>
              </div>

              <div class="suggestions-container">
                <h3 class="suggestions-title">试试这样问我：</h3>
                <div class="suggestions-grid">
                  <div v-for="s in suggestions" :key="s" class="suggestion-card" @click="sendSuggestion(s)">
                    <span>{{ s }}</span>
                    <el-icon class="suggestion-arrow">
                      <Promotion />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <template v-else>
              <div v-for="(msg, index) in messages" :key="index" class="message-wrapper"
                :class="msg.role === 'user' ? 'is-user' : 'is-ai'">
                <div class="message-avatar">
                  <div v-if="msg.role === 'user'" class="avatar-user">
                    {{ userInfo?.name?.charAt(0) || '我' }}
                  </div>
                  <div v-else class="avatar-ai">
                    <el-icon>
                      <ChatDotRound />
                    </el-icon>
                  </div>
                </div>
                <div class="message-content-box">
                  <div class="message-sender-name">{{ msg.role === 'user' ? (userInfo?.name || '我') : 'AI 数据助手' }}</div>
                  <div class="message-bubble" :class="msg.role">
                    <div class="message-text" v-html="formatMessage(msg.content)"></div>
                  </div>
                </div>
              </div>

              <!-- Loading Indicator -->
              <div v-if="loading" class="message-wrapper is-ai">
                <div class="message-avatar">
                  <div class="avatar-ai">
                    <el-icon>
                      <ChatDotRound />
                    </el-icon>
                  </div>
                </div>
                <div class="message-content-box">
                  <div class="message-sender-name">AI 数据助手</div>
                  <div class="message-bubble ai-loading">
                    <div class="dot-typing"></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-container">
          <div class="input-box">
            <el-input v-model="inputMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }"
              :placeholder="inputPlaceholder" class="modern-input" @keydown.enter.exact.prevent="sendMessage"
              :disabled="loading" />
            <button class="send-btn" :class="{ 'is-active': inputMessage.trim() && !loading }"
              :disabled="!inputMessage.trim() || loading" @click="sendMessage">
              <el-icon>
                <Promotion />
              </el-icon>
            </button>
          </div>
          <div class="input-footer">
            <span>AI 生成的内容可能存在误差，请以实际数据为准。按 Enter 发送，Shift + Enter 换行。</span>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="chat-sidebar">
        <div class="sidebar-block">
          <h3 class="block-title">快捷提问</h3>
          <div class="quick-questions">
            <div v-for="q in quickQuestions" :key="q" class="quick-q-item" @click="sendSuggestion(q)">
              <span class="q-text">{{ q }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-block capabilities-block">
          <h3 class="block-title">助手能力</h3>
          <ul class="capability-list">
            <li v-for="item in capabilities" :key="item">
              <span class="dot"></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Promotion, Delete } from '@element-plus/icons-vue'
import { aiChat } from '../api'

export default {
  name: 'AiChat',
  components: { ChatDotRound, Promotion, Delete },
  setup() {
    const inputMessage = ref('')
    const messages = ref([])
    const loading = ref(false)
    const messagesRef = ref(null)

    const userInfo = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })

    const inputPlaceholder = computed(() => (
      messages.value.length
        ? '继续输入和学生数据相关的问题'
        : '输入一个和学生数据相关的问题'
    ))

    const capabilities = [
      '查询学生结构、人数和状态分布',
      '对比学院、年级、绩点和奖学金情况',
      '识别学业预警和需要关注的群体',
      '生成简明的数据观察和结论'
    ]

    const suggestions = [
      '各学院的平均绩点是多少？',
      '有哪些学生获得了奖学金？',
      '帮我分析一下学生整体情况',
      '男女比例是多少？'
    ]

    const quickQuestions = [
      '学生总数是多少？',
      '哪个学院绩点最高？',
      '有学业预警的学生吗？',
      '奖学金获得情况如何？',
      '各年级人数分布？',
      '生成一份数据分析报告'
    ]

    const scrollToBottom = async () => {
      await nextTick()
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    }

    const formatMessage = (content) => {
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    }

    const sendMessage = async () => {
      const text = inputMessage.value.trim()
      if (!text || loading.value) return

      messages.value.push({ role: 'user', content: text })
      inputMessage.value = ''
      loading.value = true
      scrollToBottom()

      try {
        const history = messages.value.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))

        const response = await aiChat({ message: text, history })
        messages.value.push({
          role: 'assistant',
          content: response.data.reply
        })
      } catch (error) {
        messages.value.push({
          role: 'assistant',
          content: '抱歉，AI 服务暂时不可用，请稍后再试。'
        })
      } finally {
        loading.value = false
        scrollToBottom()
      }
    }

    const sendSuggestion = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    const clearChat = () => {
      messages.value = []
      ElMessage.success('对话已清空')
    }

    return {
      inputMessage,
      messages,
      loading,
      messagesRef,
      userInfo,
      inputPlaceholder,
      capabilities,
      suggestions,
      quickQuestions,
      formatMessage,
      sendMessage,
      sendSuggestion,
      clearChat
    }
  }
}
</script>

<style scoped>
.page-container {
  height: calc(100vh - 64px - 48px);
  display: flex;
  background-color: transparent;
  border-radius: 16px;
  overflow: hidden;
}

.chat-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
}

/* Main Chat Area */
.chat-main-container {
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.clear-btn {
  border-radius: 8px;
  transition: all 0.2s;
}

.chat-thread-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.chat-thread {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  scroll-behavior: smooth;
}

.chat-thread::-webkit-scrollbar {
  width: 6px;
}

.chat-thread::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.chat-thread::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Welcome Screen */
.welcome-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 10vh;
}

.welcome-hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero-icon-wrapper {
  width: 64px;
  height: 64px;
  background: #eff6ff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.hero-icon {
  font-size: 32px;
  color: #3b82f6;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.hero-desc {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.suggestions-container {
  width: 100%;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 16px 0;
  text-align: center;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.suggestion-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.suggestion-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.suggestion-arrow {
  color: #94a3b8;
  font-size: 16px;
  transition: color 0.2s;
}

.suggestion-card:hover .suggestion-arrow {
  color: #3b82f6;
}

/* Messages */
.message-wrapper {
  display: flex;
  gap: 16px;
  max-width: 85%;
}

.message-wrapper.is-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-user {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.avatar-ai {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.message-content-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
}

.message-wrapper.is-user .message-content-box {
  align-items: flex-end;
}

.message-sender-name {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin: 0 4px;
}

.message-bubble {
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: #1e293b;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.message-bubble.user {
  background-color: #3b82f6;
  color: white;
  border-top-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-top-left-radius: 4px;
}

.message-text :deep(p) {
  margin: 0 0 8px 0;
}

.message-text :deep(p:last-child) {
  margin: 0;
}

.message-text :deep(strong) {
  font-weight: 600;
  color: inherit;
}

.message-text :deep(em) {
  font-style: italic;
  opacity: 0.9;
}

/* Loading Animation */
.ai-loading {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.dot-typing {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #94a3b8;
  color: #94a3b8;
  animation: dotTyping 1.5s infinite linear;
}

.dot-typing::before,
.dot-typing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #94a3b8;
  color: #94a3b8;
}

.dot-typing::before {
  left: -12px;
  animation: dotTypingBefore 1.5s infinite linear;
}

.dot-typing::after {
  left: 12px;
  animation: dotTypingAfter 1.5s infinite linear;
}

@keyframes dotTypingBefore {
  0% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  33% {
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.4);
  }

  66% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }
}

@keyframes dotTyping {
  0% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  33% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  66% {
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.4);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }
}

@keyframes dotTypingAfter {
  0% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  33% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  66% {
    box-shadow: 0 0 0 0 rgba(148, 163, 184, 1);
  }

  100% {
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.4);
  }
}

/* Input Area */
.chat-input-container {
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #f1f5f9;
}

.input-box {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.input-box:focus-within {
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modern-input :deep(.el-textarea__inner) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 8px 4px;
  font-size: 15px;
  line-height: 1.6;
  color: #1e293b;
  resize: none;
}

.modern-input :deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

.modern-input :deep(.el-textarea__inner::placeholder) {
  color: #94a3b8;
}

.send-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 12px;
  border: none;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.send-btn.is-active {
  background: #3b82f6;
  color: white;
}

.send-btn.is-active:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.input-footer {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

/* Sidebar */
.chat-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.sidebar-block {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.block-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-q-item {
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.5;
}

.quick-q-item:hover {
  background: #eff6ff;
  color: #1d4ed8;
  transform: translateX(2px);
}

.capability-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.capability-list li {
  font-size: 13px;
  color: #475569;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}

.capability-list .dot {
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .chat-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-container {
    height: auto;
    min-height: calc(100vh - 64px - 48px);
    border-radius: 0;
  }

  .chat-wrapper {
    gap: 0;
  }

  .chat-main-container {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .message-wrapper {
    max-width: 95%;
  }

  .chat-header {
    padding: 16px;
  }

  .chat-thread {
    padding: 16px;
  }

  .chat-input-container {
    padding: 16px;
  }
}
</style>