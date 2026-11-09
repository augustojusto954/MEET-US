// frontend/src/stores/meetus.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import {
  INITIAL_STUDENTS,
  INITIAL_CONNECTIONS,
  INITIAL_EXCHANGES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_AVAILABILITY_SLOTS,
  INITIAL_UNIVERSITIES,
  INITIAL_FACULTIES,
  INITIAL_COURSES,
  INITIAL_SKILL_CATEGORIES,
  INITIAL_REPORTS
} from 'src/mock/meetus-data'

export function formatUserForStore(u) {
  if (!u) return INITIAL_STUDENTS[0]
  const id = String(u.id || u._id || '1')
  const skills = Array.isArray(u.skills) ? u.skills : []
  const skillsTeach = skills.filter(s => s.type === 'offer' || s.type === 'both').map((s, idx) => ({
    id: `st-${id}-${idx}`,
    name: typeof s === 'string' ? s : s.name,
    level: s.level || 'Avançado',
    category: 'Programação & Tech'
  }))
  const skillsLearn = skills.filter(s => s.type === 'seek').map((s, idx) => ({
    id: `sl-${id}-${idx}`,
    name: typeof s === 'string' ? s : s.name,
    level: s.level || 'Iniciante',
    category: 'Geral',
    priority: 'Alta'
  }))

  return {
    id,
    name: u.name || 'Estudante',
    email: u.email || '',
    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Estudante')}&background=059669&color=fff&size=256&bold=true`,
    cover: u.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
    bio: u.bio || `Estudante universitário em Moçambique na área de ${u.course || 'Ensino Superior'}.`,
    institution: u.institution || 'Universidade Eduardo Mondlane',
    course: u.course || 'Engenharia Informática',
    year: u.year || 3,
    city: u.city || 'Maputo',
    availability: u.availability || 'Tardes e fins de semana',
    reputation: u.reputation || 5.0,
    reviews_count: u.reviews_count || 0,
    verified: u.verified !== undefined ? !!u.verified : true,
    online: Boolean(u.online),
    compatibilityScore: 95,
    skillsTeach: (u.skillsTeach && u.skillsTeach.length > 0) ? u.skillsTeach : (skillsTeach.length > 0 ? skillsTeach : [
      { id: `st-${id}-0`, name: u.course || 'Metodologia de Estudo', level: 'Intermédio', category: 'Académico' }
    ]),
    skillsLearn: (u.skillsLearn && u.skillsLearn.length > 0) ? u.skillsLearn : (skillsLearn.length > 0 ? skillsLearn : [
      { id: `sl-${id}-0`, name: 'Inglês Técnico', level: 'Iniciante', category: 'Línguas', priority: 'Alta' }
    ]),
    interests: u.interests || ['Tecnologia', 'Educação', 'Moçambique'],
    privacy: u.privacy || { publicProfile: true, showUniversity: true, showAvailability: true, allowMessagesFrom: 'everyone' }
  }
}

function getInitialCurrentUser() {
  const authUserStr = localStorage.getItem('meetus_user')
  if (authUserStr) {
    try {
      const u = JSON.parse(authUserStr)
      if (u && (u.name || u.id || u._id)) {
        return formatUserForStore(u)
      }
    } catch (_) {}
  }
  const savedCurrent = localStorage.getItem('meetus_currentUser')
  if (savedCurrent) {
    try {
      const u = JSON.parse(savedCurrent)
      if (u && u.name && !u.name.includes('(Você)')) return u
    } catch (_) {}
  }
  return INITIAL_STUDENTS[0]
}

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(`meetus_${key}`)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}:`, e)
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(`meetus_${key}`, JSON.stringify(data))
  } catch (e) {
    console.warn(`Error saving localStorage for ${key}:`, e)
  }
}

export const useMeetUsStore = defineStore('meetus', {
  state: () => ({
    currentUser: getInitialCurrentUser(),
    students: loadFromStorage('students', INITIAL_STUDENTS),
    connections: loadFromStorage('connections', INITIAL_CONNECTIONS),
    exchanges: loadFromStorage('exchanges', INITIAL_EXCHANGES),
    posts: loadFromStorage('posts', INITIAL_COMMUNITY_POSTS),
    conversations: loadFromStorage('conversations', INITIAL_CONVERSATIONS),
    achievements: loadFromStorage('achievements', INITIAL_ACHIEVEMENTS),
    reviews: loadFromStorage('reviews', INITIAL_REVIEWS),
    notifications: loadFromStorage('notifications', INITIAL_NOTIFICATIONS),
    calendarEvents: loadFromStorage('calendarEvents', INITIAL_CALENDAR_EVENTS),
    availabilitySlots: loadFromStorage('availabilitySlots', INITIAL_AVAILABILITY_SLOTS),
    universities: loadFromStorage('universities', INITIAL_UNIVERSITIES),
    faculties: loadFromStorage('faculties', INITIAL_FACULTIES),
    courses: loadFromStorage('courses', INITIAL_COURSES),
    skillCategories: loadFromStorage('skillCategories', INITIAL_SKILL_CATEGORIES),
    reports: loadFromStorage('reports', INITIAL_REPORTS),
    globalSearchQuery: ''
  }),

  getters: {
    unreadNotificationsCount: (state) => state.notifications.filter(n => !n.read).length,
    unreadMessagesCount: (state) => state.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    activeExchangesCount: (state) => state.exchanges.filter(e => ['accepted', 'running'].includes(e.status)).length,
    pendingExchangesCount: (state) => state.exchanges.filter(e => e.status === 'pending').length,
    myConnectionsList: (state) => {
      const activeConnStudentIds = state.connections.filter(c => c.status === 'connected').map(c => c.studentId)
      return state.students.filter(s => activeConnStudentIds.includes(s.id))
    },
    receivedRequestsList: (state) => {
      const ids = state.connections.filter(c => c.status === 'received').map(c => c.studentId)
      return state.students.filter(s => ids.includes(s.id))
    },
    sentRequestsList: (state) => {
      const ids = state.connections.filter(c => c.status === 'sent').map(c => c.studentId)
      return state.students.filter(s => ids.includes(s.id))
    },
    suggestedStudentsList: (state) => {
      const connectedOrPending = new Set([
        state.currentUser.id,
        ...state.connections.map(c => c.studentId)
      ])
      return state.students.filter(s => !connectedOrPending.has(s.id))
    }
  },

  actions: {
    _persist(key) {
      saveToStorage(key, this[key])
    },

    // --- Profile & User ---
    setCurrentUser(userData) {
      if (!userData) return
      const formatted = formatUserForStore(userData)
      this.currentUser = formatted
      this._persist('currentUser')
      // Atualiza ou insere o utilizador real na lista de estudantes
      const idx = this.students.findIndex(s => s.id === formatted.id || (formatted.email && s.email === formatted.email))
      if (idx !== -1) {
        this.students[idx] = { ...this.students[idx], ...formatted }
      } else {
        this.students.unshift(formatted)
      }
      this._persist('students')
    },

    clearCurrentUser() {
      localStorage.removeItem('meetus_currentUser')
      this.currentUser = INITIAL_STUDENTS[0]
    },

    updateCurrentUser(profileData) {
      this.currentUser = { ...this.currentUser, ...profileData }
      // also update in students list
      const idx = this.students.findIndex(s => s.id === this.currentUser.id)
      if (idx !== -1) {
        this.students[idx] = { ...this.students[idx], ...profileData }
        this._persist('students')
      }
      this._persist('currentUser')
    },

    // --- Skills Management ---
    addSkillTeach(skill) {
      const newSkill = { id: `st-${Date.now()}`, ...skill }
      this.currentUser.skillsTeach = [...(this.currentUser.skillsTeach || []), newSkill]
      this.updateCurrentUser({ skillsTeach: this.currentUser.skillsTeach })
    },

    removeSkillTeach(skillId) {
      this.currentUser.skillsTeach = (this.currentUser.skillsTeach || []).filter(s => s.id !== skillId)
      this.updateCurrentUser({ skillsTeach: this.currentUser.skillsTeach })
    },

    addSkillLearn(skill) {
      const newSkill = { id: `sl-${Date.now()}`, ...skill }
      this.currentUser.skillsLearn = [...(this.currentUser.skillsLearn || []), newSkill]
      this.updateCurrentUser({ skillsLearn: this.currentUser.skillsLearn })
    },

    removeSkillLearn(skillId) {
      this.currentUser.skillsLearn = (this.currentUser.skillsLearn || []).filter(s => s.id !== skillId)
      this.updateCurrentUser({ skillsLearn: this.currentUser.skillsLearn })
    },

    // --- Connections ---
    sendConnectionRequest(studentId, note = '') {
      const existing = this.connections.find(c => c.studentId === studentId)
      if (existing) {
        existing.status = 'sent'
        existing.requestedAt = 'Agora mesmo'
        existing.note = note
      } else {
        this.connections.push({
          id: `conn-${Date.now()}`,
          studentId,
          status: 'sent',
          requestedAt: 'Agora mesmo',
          note
        })
      }
      this._persist('connections')
    },

    acceptConnection(studentId) {
      const conn = this.connections.find(c => c.studentId === studentId)
      if (conn) {
        conn.status = 'connected'
        conn.connectedSince = new Date().toISOString().split('T')[0]
        this._persist('connections')
      }
      // Add notification
      const student = this.students.find(s => s.id === studentId)
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        category: 'Connections',
        title: 'Nova Conexão Estabelecida!',
        body: `Agora estás conectado com ${student?.name || 'um estudante'}.`,
        date: 'Agora mesmo',
        read: false,
        link: '/connections'
      })
      this._persist('notifications')
    },

    declineConnection(studentId) {
      this.connections = this.connections.filter(c => c.studentId !== studentId)
      this._persist('connections')
    },

    cancelConnectionRequest(studentId) {
      this.connections = this.connections.filter(c => c.studentId !== studentId)
      this._persist('connections')
    },

    removeConnection(studentId) {
      this.connections = this.connections.filter(c => c.studentId !== studentId)
      this._persist('connections')
    },

    // --- Exchanges ---
    createExchangeRequest(payload) {
      const newExc = {
        id: `exc-${Date.now()}`,
        partnerId: payload.partnerId,
        partnerName: payload.partnerName,
        partnerAvatar: payload.partnerAvatar,
        partnerUniversity: payload.partnerUniversity || 'UEM',
        partnerCourse: payload.partnerCourse || 'Graduação',
        skillGiven: payload.skillGiven,
        skillReceived: payload.skillReceived,
        goal: payload.goal,
        mode: payload.mode || 'Online (Sala MEET-US)',
        scheduledDate: payload.scheduledDate,
        scheduledTime: payload.scheduledTime,
        duration: payload.duration || '60 minutos',
        status: 'pending',
        notes: payload.notes || '',
        timeline: [
          { title: 'Pedido Enviado', date: 'Agora mesmo', done: true },
          { title: 'Aguardando Resposta do Parceiro', date: 'Em análise', done: false }
        ]
      }
      this.exchanges.unshift(newExc)
      this._persist('exchanges')

      // Also create a calendar event
      this.calendarEvents.push({
        id: `ev-${Date.now()}`,
        title: `Troca: ${payload.skillGiven} ⇄ ${payload.skillReceived}`,
        date: payload.scheduledDate,
        time: payload.scheduledTime,
        type: 'exchange',
        partner: payload.partnerName,
        mode: payload.mode,
        color: '#5B55D6'
      })
      this._persist('calendarEvents')

      return newExc
    },

    updateExchangeStatus(exchangeId, newStatus) {
      const exc = this.exchanges.find(e => e.id === exchangeId)
      if (exc) {
        exc.status = newStatus
        if (newStatus === 'accepted') {
          exc.timeline.push({ title: 'Pedido Aceite', date: 'Hoje', done: true })
        } else if (newStatus === 'running') {
          exc.timeline.push({ title: 'Sessão em Andamento', date: 'Hoje', done: true })
        } else if (newStatus === 'completed') {
          exc.timeline.push({ title: 'Sessão Concluída com Sucesso', date: 'Hoje', done: true })
        }
        this._persist('exchanges')
      }
    },

    rescheduleExchange(exchangeId, newDate, newTime) {
      const exc = this.exchanges.find(e => e.id === exchangeId)
      if (exc) {
        exc.scheduledDate = newDate
        exc.scheduledTime = newTime
        exc.timeline.push({ title: `Reagendado para ${newDate} às ${newTime}`, date: 'Hoje', done: true })
        this._persist('exchanges')
      }
    },

    // --- Community Posts ---
    async createPost(post) {
      let activeUser = this.currentUser
      try {
        const authUserStr = localStorage.getItem('meetus_user')
        if (authUserStr) {
          const u = JSON.parse(authUserStr)
          if (u && (u.name || u.id || u._id)) {
            activeUser = formatUserForStore(u)
            this.currentUser = activeUser
          }
        }
      } catch (_) {}

      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          id: String(activeUser.id || activeUser._id || 'me'),
          name: activeUser.name,
          avatar: activeUser.avatar,
          institution: activeUser.institution,
          course: activeUser.course
        },
        title: post.title,
        content: post.content,
        category: post.category || 'Geral',
        likesCount: 0,
        isLiked: false,
        saved: false,
        createdAt: 'Agora mesmo',
        tags: post.tags || [],
        comments: []
      }
      this.posts.unshift(newPost)
      this._persist('posts')

      try {
        const res = await api.post('/posts', {
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          authorId: String(activeUser.id || activeUser._id || ''),
          authorName: activeUser.name,
          authorAvatar: activeUser.avatar,
          authorCourse: activeUser.course,
          authorInstitution: activeUser.institution
        })
        if (res.data?._id || res.data?.id) {
          newPost.id = String(res.data._id || res.data.id)
          if (res.data.author_name) {
            newPost.author.name = res.data.author_name
            newPost.author.avatar = res.data.author_avatar || newPost.author.avatar
            newPost.author.course = res.data.author_course || newPost.author.course
            newPost.author.institution = res.data.author_institution || newPost.author.institution
          }
          this._persist('posts')
        }
      } catch (err) {
        console.warn('Backend API post creation fallback:', err.message)
      }

      return newPost
    },

    async toggleLikePost(postId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.isLiked = !post.isLiked
        post.likesCount += post.isLiked ? 1 : -1
        this._persist('posts')

        try {
          const activeId = String(this.currentUser?.id || this.currentUser?._id || '')
          await api.post(`/posts/${postId}/like`, { userId: activeId })
        } catch (err) {
          console.warn('Backend like sync error:', err.message)
        }
      }
    },

    toggleSavePost(postId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.saved = !post.saved
        this._persist('posts')
      }
    },

    async addCommentToPost(postId, commentText) {
      const post = this.posts.find(p => p.id === postId)
      if (post && commentText.trim()) {
        let activeUser = this.currentUser
        try {
          const authUserStr = localStorage.getItem('meetus_user')
          if (authUserStr) {
            const u = JSON.parse(authUserStr)
            if (u && (u.name || u.id || u._id)) {
              activeUser = formatUserForStore(u)
            }
          }
        } catch (_) {}

        const commentObj = {
          id: `c-${Date.now()}`,
          authorName: activeUser.name,
          authorAvatar: activeUser.avatar,
          text: commentText.trim(),
          createdAt: 'Agora mesmo'
        }
        post.comments.push(commentObj)
        this._persist('posts')

        try {
          await api.post(`/posts/${postId}/comment`, {
            text: commentText.trim(),
            authorId: String(activeUser.id || activeUser._id || ''),
            authorName: activeUser.name,
            authorAvatar: activeUser.avatar
          })
        } catch (err) {
          console.warn('Backend comment sync error:', err.message)
        }
      }
    },

    // --- Messages / Chat ---
    sendMessage(conversationId, text) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (conv && text.trim()) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        conv.messages.push({
          id: `m-${Date.now()}`,
          sender: 'me',
          text: text.trim(),
          time
        })
        conv.lastMessage = text.trim()
        conv.lastMessageAt = time
        this._persist('conversations')
      }
    },

    // --- Reviews ---
    addReview(reviewData) {
      const newRev = {
        id: `rev-${Date.now()}`,
        reviewerName: this.currentUser.name,
        reviewerAvatar: this.currentUser.avatar,
        reviewerCourse: this.currentUser.course,
        rating: reviewData.rating || 5,
        date: 'Hoje',
        exchangeTopic: reviewData.topic || 'Sessão Colaborativa',
        comment: reviewData.comment || '',
        criteria: reviewData.criteria || { didatica: 5, pontualidade: 5, dominio: 5 }
      }
      this.reviews.unshift(newRev)
      this._persist('reviews')
      return newRev
    },

    // --- Notifications ---
    markNotificationAsRead(id) {
      const notif = this.notifications.find(n => n.id === id)
      if (notif) {
        notif.read = true
        this._persist('notifications')
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach(n => { n.read = true })
      this._persist('notifications')
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
      this._persist('notifications')
    },

    // --- Availability & Calendar ---
    addAvailabilitySlot(slot) {
      this.availabilitySlots.push({ id: `av-${Date.now()}`, ...slot })
      this._persist('availabilitySlots')
    },

    removeAvailabilitySlot(id) {
      this.availabilitySlots = this.availabilitySlots.filter(s => s.id !== id)
      this._persist('availabilitySlots')
    },

    // --- Admin Actions ---
    verifyStudent(studentId) {
      const s = this.students.find(st => st.id === studentId)
      if (s) {
        s.verified = !s.verified
        this._persist('students')
      }
    },

    toggleSuspendStudent(studentId) {
      const s = this.students.find(st => st.id === studentId)
      if (s) {
        s.suspended = !s.suspended
        this._persist('students')
      }
    },

    addUniversity(uni) {
      this.universities.push({ id: `uni-${Date.now()}`, ...uni, verified: true })
      this._persist('universities')
    },

    addCourse(course) {
      this.courses.push({ id: `course-${Date.now()}`, ...course })
      this._persist('courses')
    },

    resolveReport(reportId, actionTaken = 'Resolvido') {
      const r = this.reports.find(rep => rep.id === reportId)
      if (r) {
        r.status = 'closed'
        r.actionTaken = actionTaken
        this._persist('reports')
      }
    },

    // --- Live MongoDB Backend Synchronization ---
    async syncWithBackend() {
      try {
        // Sync Users / Students from MongoDB
        const usersRes = await api.get('/users?limit=30')
        const userItems = usersRes.data?.items || usersRes.data
        if (Array.isArray(userItems) && userItems.length > 0) {
          this.students = userItems.map(u => ({
            id: String(u._id || u.id),
            name: u.name,
            email: u.email,
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Estudante')}&background=059669&color=fff&size=256&bold=true`,
            cover: u.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
            bio: u.bio || 'Estudante universitário em Moçambique.',
            institution: u.institution || 'Universidade Eduardo Mondlane',
            course: u.course || 'Engenharia',
            year: u.year || 3,
            city: u.city || 'Maputo',
            availability: u.availability || 'Tardes e fins de semana',
            reputation: u.reputation || 4.8,
            reviews_count: u.reviews_count || 12,
            verified: !!u.verified,
            online: !!u.online,
            compatibilityScore: 85 + (parseInt(String(u._id || u.id).slice(-1), 10) || 5),
            skillsTeach: (u.skills || []).filter(s => s.type === 'offer').map((s, idx) => ({
              id: `st-${u._id}-${idx}`,
              name: s.name,
              level: s.level || 'Avançado',
              category: 'Programação & Tech'
            })),
            skillsLearn: (u.skills || []).filter(s => s.type === 'seek').map((s, idx) => ({
              id: `sl-${u._id}-${idx}`,
              name: s.name,
              level: s.level || 'Iniciante',
              category: 'Geral',
              priority: 'Alta'
            })),
            interests: u.interests || ['Tecnologia', 'Educação', 'Música Moçambicana']
          }))
          this._persist('students')

          // Sincroniza o utilizador atual com a conta real autenticada
          const authUserStr = localStorage.getItem('meetus_user')
          if (authUserStr) {
            try {
              const authUser = JSON.parse(authUserStr)
              const authId = String(authUser.id || authUser._id || '')
              const matchedCurrent = this.students.find(s => s.id === authId || (authUser.email && s.email === authUser.email))
              if (matchedCurrent) {
                this.currentUser = { ...matchedCurrent, ...authUser }
                this._persist('currentUser')
              } else if (authUser.name) {
                this.setCurrentUser(authUser)
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('[Sync] Could not fetch live users from MongoDB:', err.message)
      }

      try {
        // Sync Posts from MongoDB
        const postsRes = await api.get('/posts')
        if (Array.isArray(postsRes.data) && postsRes.data.length > 0) {
          this.posts = postsRes.data.map(p => ({
            id: String(p._id || p.id),
            author: {
              id: p.author_id,
              name: p.author_name,
              avatar: p.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.author_name || 'Autor')}&background=059669&color=fff&size=256&bold=true`,
              institution: p.author_institution,
              course: p.author_course
            },
            title: p.title,
            content: p.content,
            category: p.category || 'Geral',
            likesCount: p.likes_count || p.likesCount || 0,
            isLiked: Boolean(this.currentUser?.id && (p.likes || []).map(String).includes(String(this.currentUser.id))),
            saved: false,
            createdAt: new Date(p.createdAt || Date.now()).toLocaleDateString('pt-MZ'),
            tags: p.tags || ['MEETUS'],
            comments: (p.comments || []).map(c => ({
              id: String(c._id || `c-${Math.random()}`),
              authorName: c.author_name,
              authorAvatar: c.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author_name || 'Comentador')}&background=059669&color=fff&size=256&bold=true`,
              text: c.text,
              createdAt: new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
          }))
          this._persist('posts')
        }
      } catch (err) {
        console.warn('[Sync] Could not fetch live posts from MongoDB:', err.message)
      }
    },

    updateUserPresence(userId, isOnline) {
      if (!userId) return
      const sId = String(userId)
      const student = this.students.find(s => String(s.id) === sId || String(s._id) === sId)
      if (student) {
        student.online = Boolean(isOnline)
      }
      if (this.currentUser && (String(this.currentUser.id) === sId || String(this.currentUser._id) === sId)) {
        this.currentUser.online = Boolean(isOnline)
      }
    },

    setOnlineUsers(onlineUserIds = []) {
      const set = new Set(onlineUserIds.map(id => String(id)))
      this.students.forEach(s => {
        s.online = set.has(String(s.id || s._id))
      })
      if (this.currentUser) {
        this.currentUser.online = set.has(String(this.currentUser.id || this.currentUser._id))
      }
    }
  }
})
