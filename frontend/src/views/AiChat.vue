<template>
  <div class="page-container">
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
      <div class="chat-main">
        <div class="chat-panel">
          <div class="chat-thread" ref="messagesRef">
            <div v-if="messages.length === 0" class="welcome-state">
              <div class="welcome-card">
                <div class="welcome-header">
                  <div class="welcome-icon">
                    <el-icon :size="26"><ChatDotRound /></el-icon>
                  </div>
                  <div class="welcome-copy">
                    <span class="welcome-kicker">数据助手</span>
                    <h3 class="welcome-title">围绕学生数据直接提问</h3>
                    <p class="welcome-desc">
                      支持学生档案、成绩走势、奖学金、学业预警和结构分析。回答基于系统内的真实数据，不做泛泛介绍。
                    </p>
                  </div>
                </div>

                <div class="capability-list">
                  <div
                    v-for="item in capabilities"
                    :key="item"
                    class="capability-item"
                  >
                    <span class="capability-dot"></span>
                    <span>{{ item }}</span>
                  </div>
                </div>

                <div class="welcome-section-title">建议直接这样问</div>
                <div class="suggestion-grid">
                  <button
                    v-for="s in suggestions"
                    :key="s"
                    type="button"
                    class="suggestion-card"
                    @click="sendSuggestion(s)"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>
            </div>

            <template v-else>
              <div
                v-for="(msg, index) in messages"
                :key="index"
                class="message-row"
                :class="msg.role === 'user' ? 'message-user' : 'message-ai'"
              >
                <div class="message-avatar">
                  <el-avatar
                    v-if="msg.role === 'user'"
                    :size="36"
                    class="avatar-user"
                  >
                    {{ userInfo?.name?.charAt(0) || '我' }}
                  </el-avatar>
                  <div v-else class="avatar-ai">
                    <el-icon :size="18"><ChatDotRound /></el-icon>
                  </div>
                </div>

                <div class="message-content">
                  <div class="message-meta">
                    <span class="message-sender">{{ msg.role === 'user' ? '我' : 'AI 助手' }}</span>
                    <span v-if="msg.role !== 'user'" class="message-label">真实数据</span>
                  </div>
                  <div class="message-bubble" :class="msg.role">
                    <div class="message-text" v-html="formatMessage(msg.content)"></div>
                  </div>
                </div>
              </div>

              <div v-if="loading" class="message-row message-ai">
                <div class="message-avatar">
                  <div class="avatar-ai">
                    <el-icon :size="18"><ChatDotRound /></el-icon>
                  </div>
                </div>

                <div class="message-content">
                  <div class="message-meta">
                    <span class="message-sender">AI 助手</span>
                    <span class="message-label">处理中</span>
                  </div>
                  <div class="message-bubble assistant">
                    <div class="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="chat-input-area">
            <div class="composer-shell">
              <div class="composer-copy">
                <span class="composer-title">继续提问</span>
                <span class="composer-subtitle">可追问、对比、让 AI 生成简要分析</span>
              </div>

              <div class="input-wrapper">
                <el-input
                  v-model="inputMessage"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  :placeholder="inputPlaceholder"
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

              <div class="input-hint">按 Enter 发送，Shift + Enter 换行</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-sidebar">
        <div class="sidebar-panel">
          <div class="panel-header">
            <h3 class="panel-title">常用问题</h3>
          </div>
          <div class="panel-body p-0">
            <div class="quick-list">
              <button
                v-for="q in quickQuestions"
                :key="q"
                type="button"
                class="quick-item"
                @click="sendSuggestion(q)"
              >
                <span class="quick-item-text">{{ q }}</span>
                <span class="quick-item-arrow">↗</span>
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
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 64px - 48px);
  min-height: 0;
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
  border-radius: 6px;
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

.chat-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
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
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.chat-thread {
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-height: 0;
}

.chat-thread::-webkit-scrollbar {
  display: none;
}

.welcome-state {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 8px;
}

.welcome-card {
  background:
    linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.welcome-icon {
  width: 52px;
  height: 52px;
  background-color: #111827;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.welcome-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
}

.welcome-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  text-align: left;
}

.welcome-desc {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
  text-align: left;
  max-width: 680px;
}

.capability-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 22px;
  font-size: 13px;
  color: #374151;
}

.capability-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #3b82f6;
  flex-shrink: 0;
}

.welcome-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.02em;
  text-align: left;
}

.suggestion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.suggestion-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  line-height: 1.5;
  min-height: 58px;
}

.suggestion-card:hover {
  background: #f8fafc;
  border-color: #bfdbfe;
  color: #111827;
  transform: translateY(-1px);
}

.message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
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
  font-size: 14px;
}

.avatar-ai {
  width: 36px;
  height: 36px;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.message-content {
  max-width: min(820px, calc(100% - 48px));
  min-width: 0;
}

.message-user .message-content {
  max-width: min(520px, 72%);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.message-user .message-meta {
  justify-content: flex-end;
}

.message-sender,
.message-label {
  font-size: 12px;
  font-weight: 500;
}

.message-sender {
  color: #6b7280;
}

.message-label {
  color: #2563eb;
  background-color: #eff6ff;
  padding: 3px 8px;
  border-radius: 999px;
}

.message-bubble {
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.75;
  word-break: break-word;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.message-bubble.user {
  background-color: #111827;
  color: white;
  border-bottom-right-radius: 4px;
  border-color: #111827;
}

.message-bubble.assistant {
  background-color: #f8fafc;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  border-color: #e5e7eb;
}

.message-text {
  text-align: left;
}

.message-text :deep(p:first-child) {
  margin-top: 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(strong) {
  color: inherit;
}

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

.chat-input-area {
  padding: 16px 24px 24px;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  background:
    linear-gradient(180deg, rgba(249, 250, 251, 0.3) 0%, #ffffff 100%);
}

.composer-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
}

.composer-copy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.composer-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.composer-subtitle {
  font-size: 12px;
  color: #6b7280;
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
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  resize: none;
  line-height: 1.6;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  background-color: white;
}

.chat-input :deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
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
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.16);
}

.send-btn.is-active:hover {
  background-color: #374151;
}

.input-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
}

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
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
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
  padding: 14px 20px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.quick-item:last-child {
  border-bottom: none;
}

.quick-item:hover {
  background-color: #f8fafc;
  color: #111827;
}

.quick-item-text {
  line-height: 1.5;
}

.quick-item-arrow {
  color: #9ca3af;
  font-size: 12px;
  flex-shrink: 0;
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

@media (max-width: 900px) {
  .page-container {
    height: auto;
    min-height: calc(100vh - 64px - 48px);
  }

  .capability-list,
  .suggestion-grid {
    grid-template-columns: 1fr;
  }

  .composer-copy {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .chat-thread {
    padding: 16px 16px 0;
  }

  .chat-input-area {
    padding: 12px 16px 16px;
  }

  .welcome-card,
  .composer-shell {
    padding: 16px;
  }

  .message-content,
  .message-user .message-content {
    max-width: calc(100% - 48px);
  }

  .input-wrapper {
    align-items: stretch;
  }

  .send-btn {
    width: 44px;
    min-width: 44px;
  }
}
</style>
