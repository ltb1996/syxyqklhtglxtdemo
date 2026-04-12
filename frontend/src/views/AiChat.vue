<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">AI 智能问答</h1>
        <p class="page-subtitle">基于学生数据的智能分析与问答</p>
      </div>
      <div class="header-actions">
        <el-button class="secondary-btn" @click="clearChat">
          <el-icon><Delete /></el-icon>清空对话
        </el-button>
      </div>
    </div>

    <div class="chat-layout">
      <!-- 主聊天区域 -->
      <div class="chat-main">
        <div class="chat-panel">
          <!-- 消息列表 -->
          <div class="chat-messages" ref="messagesRef">
            <!-- 欢迎消息 -->
            <div v-if="messages.length === 0" class="welcome-block">
              <div class="welcome-icon">
                <el-icon :size="40"><ChatDotRound /></el-icon>
              </div>
              <h3 class="welcome-title">你好，我是 AI 助手</h3>
              <p class="welcome-desc">我可以帮你分析学生数据、回答相关问题。试试以下问题：</p>
              <div class="suggestion-grid">
                <button class="suggestion-card" v-for="s in suggestions" :key="s" @click="sendSuggestion(s)">
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- 消息列表 -->
            <div v-for="(msg, index) in messages" :key="index"
              class="message-row" :class="msg.role === 'user' ? 'message-user' : 'message-ai'">
              <div class="message-avatar">
                <el-avatar :size="32" v-if="msg.role === 'user'" class="avatar-user">
                  {{ userInfo?.name?.charAt(0) || '我' }}
                </el-avatar>
                <div v-else class="avatar-ai">
                  <el-icon :size="18"><ChatDotRound /></el-icon>
                </div>
              </div>
              <div class="message-content">
                <div class="message-sender">{{ msg.role === 'user' ? '我' : 'AI 助手' }}</div>
                <div class="message-bubble" :class="msg.role">
                  <div v-html="formatMessage(msg.content)"></div>
                </div>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="message-row message-ai">
              <div class="message-avatar">
                <div class="avatar-ai">
                  <el-icon :size="18"><ChatDotRound /></el-icon>
                </div>
              </div>
              <div class="message-content">
                <div class="message-sender">AI 助手</div>
                <div class="message-bubble assistant">
                  <div class="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <div class="input-wrapper">
              <el-input
                v-model="inputMessage"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 4 }"
                placeholder="输入你的问题..."
                class="chat-input"
                @keydown.enter.exact.prevent="sendMessage"
                :disabled="loading"
              />
              <el-button
                class="send-btn"
                :class="{ 'is-active': inputMessage.trim() }"
                :disabled="!inputMessage.trim() || loading"
                @click="sendMessage"
              >
                <el-icon><Promotion /></el-icon>
              </el-button>
            </div>
            <div class="input-hint">按 Enter 发送，AI 基于系统真实数据回答</div>
          </div>
        </div>
      </div>

      <!-- 右侧快捷面板 -->
      <div class="chat-sidebar">
        <div class="sidebar-panel">
          <div class="panel-header">
            <h3 class="panel-title">常用问题</h3>
          </div>
          <div class="panel-body p-0">
            <div class="quick-list">
              <button class="quick-item" v-for="q in quickQuestions" :key="q" @click="sendSuggestion(q)">
                {{ q }}
              </button>
            </div>
          </div>
        </div>

        <div class="sidebar-panel">
          <div class="panel-header">
            <h3 class="panel-title">使用说明</h3>
          </div>
          <div class="panel-body">
            <div class="tips-list">
              <div class="tip-item">
                <span class="tip-dot"></span>
                <span>支持自然语言提问</span>
              </div>
              <div class="tip-item">
                <span class="tip-dot"></span>
                <span>基于系统真实数据回答</span>
              </div>
              <div class="tip-item">
                <span class="tip-dot"></span>
                <span>可进行数据分析和对比</span>
              </div>
              <div class="tip-item">
                <span class="tip-dot"></span>
                <span>支持多轮连续对话</span>
              </div>
            </div>
          </div>
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
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 64px - 48px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-shrink: 0;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
  text-align: left;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.secondary-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

/* 布局 */
.chat-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

@media (max-width: 1024px) {
  .chat-layout {
    grid-template-columns: 1fr;
  }
  .chat-sidebar {
    display: none;
  }
}

/* 主聊天区 */
.chat-main {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chat-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 消息列表 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-messages::-webkit-scrollbar {
  display: none;
}

/* 欢迎块 */
.welcome-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 20px;
  text-align: center;
}

.welcome-icon {
  width: 72px;
  height: 72px;
  background-color: #f3f4f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-bottom: 20px;
}

.welcome-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.welcome-desc {
  margin: 0 0 24px;
  font-size: 14px;
  color: #6b7280;
}

.suggestion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 500px;
  width: 100%;
}

.suggestion-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  line-height: 1.5;
}

.suggestion-card:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}

/* 消息行 */
.message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-user {
  background-color: #111827;
  color: white;
  font-weight: 600;
  font-size: 13px;
}

.avatar-ai {
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.message-content {
  max-width: 70%;
  min-width: 0;
}

.message-sender {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
  font-weight: 500;
}

.message-user .message-sender {
  text-align: right;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.message-bubble.user {
  background-color: #111827;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* 输入区域 */
.chat-input-area {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-textarea__inner) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  resize: none;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.chat-input :deep(.el-textarea__inner:focus) {
  border-color: #111827;
  box-shadow: 0 0 0 1px #111827;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #e5e7eb;
  border: none;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn.is-active {
  background-color: #111827;
  color: white;
}

.send-btn.is-active:hover {
  background-color: #374151;
}

.input-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

/* 右侧面板 */
.chat-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.sidebar-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.panel-header {
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.panel-body {
  padding: 16px 20px;
}

.panel-body.p-0 {
  padding: 0;
}

.quick-list {
  display: flex;
  flex-direction: column;
}

.quick-item {
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.15s;
}

.quick-item:last-child {
  border-bottom: none;
}

.quick-item:hover {
  background-color: #f9fafb;
  color: #111827;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #4b5563;
}

.tip-dot {
  width: 6px;
  height: 6px;
  background-color: #3b82f6;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
