// frontend/src/db/seed.js

const SKILLS_POOL = [
  'JavaScript', 'Python', 'Design Gráfico', 'Fotografia', 'Matemática',
  'Física', 'Inglês', 'Espanhol', 'Marketing Digital', 'Excel',
  'Redação', 'Violão', 'Piano', 'UI/UX', 'React', 'Vue.js',
  'Node.js', 'Estatística', 'Química', 'Biologia', 'Edição de Vídeo',
  'Locução', 'Tradução', 'Git', 'SQL'
]

const INTERESTS_POOL = [
  'Música', 'Desporto', 'Leitura', 'Tecnologia', 'Arte',
  'Viagens', 'Cinema', 'Gaming', 'Empreendedorismo', 'Voluntariado',
  'Fotografia', 'Culinária', 'Astronomia', 'História', 'Ciência'
]

const INSTITUTIONS = [
  'Universidade Eduardo Mondlane',
  'Universidade Pedagógica',
  'ISCTEM',
  'Universidade Save',
  'A Politécnica'
]

const FIRST_NAMES = [
  'Ana','Bruno','Carla','Daniel','Elsa','Fábio','Gabriela','Hélder','Inês','João',
  'Kelly','Luís','Marta','Nuno','Olga','Paulo','Quitéria','Rui','Sofia','Tomás',
  'Ubaldo','Vitória','Wilson','Xavier','Yara','Zacarias','Amélia','Benedito'
]

const LAST_NAMES = [
  'Silva','Santos','Mabjaia','Chissano','Mucavele','Macuácua','Bila','Nhaca',
  'Tembe','Cossa','Mondlane','Matusse','Lang','Ndlovu','Muianga'
]

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

export function buildSeed(db) {
  const BLACK_AVATARS_POOL = [
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1520451644838-906a72aa7c86?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1561406636-b80293969660?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=faces'
  ];

  // ---- Utilizadores ----
  const users = []
  users.push({
    name: 'Edson Mondlane',
    email: 'demo@meetus.mz',
    password: 'demo1234',
    avatar: BLACK_AVATARS_POOL[0],
    bio: 'Estudante de Engenharia Informática na UEM apaixonado por desenvolvimento frontend e trocar conhecimentos.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Engenharia Informática',
    year: 3,
    city: 'Maputo',
    availability: 'Tardes e fins de semana',
    reputation: 4.9,
    reviews_count: 24,
    verified: 1,
    online: 1
  })

  for (let i = 0; i < 25; i++) {
    const fn = rand(FIRST_NAMES)
    const ln = rand(LAST_NAMES)
    users.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@meetus.mz`,
      password: 'password123',
      avatar: BLACK_AVATARS_POOL[(i + 1) % BLACK_AVATARS_POOL.length],
      bio: `${fn} é estudante universitário moçambicano e adora partilhar competências práticas.`,
      institution: rand(INSTITUTIONS),
      course: rand(['Engenharia Informática','Medicina','Direito','Economia','Arquitetura','Design','Matemática']),
      year: randInt(1, 5),
      city: rand(['Maputo','Matola','Beira','Nampula','Quelimane']),
      availability: rand(['Manhãs','Tardes','Noites','Fins de semana','Flexível']),
      reputation: +(Math.random() * 3 + 2).toFixed(1),
      reviews_count: randInt(0, 30),
      verified: Math.random() > 0.4 ? 1 : 0,
      online: Math.random() > 0.6 ? 1 : 0
    })
  }

  const insertUser = db.prepare(`
    INSERT INTO users
      (name,email,password,avatar,bio,institution,course,year,city,availability,reputation,reviews_count,verified,online)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `)

  const userIds = []
  for (const u of users) {
    insertUser.run([
      u.name, u.email, u.password, u.avatar, u.bio, u.institution,
      u.course, u.year, u.city, u.availability, u.reputation,
      u.reviews_count, u.verified, u.online
    ])
    userIds.push(db.exec('SELECT last_insert_rowid() AS id')[0].values[0][0])
  }
  insertUser.free()

  // ---- Skills / Interests ----
  const insertSkill = db.prepare(`INSERT INTO skills (user_id,name,type,level) VALUES (?,?,?,?)`)
  const insertInterest = db.prepare(`INSERT INTO interests (user_id,name) VALUES (?,?)`)

  for (const uid of userIds) {
    const nSkills = randInt(2, 5)
    const used = new Set()
    for (let i = 0; i < nSkills; i++) {
      const s = rand(SKILLS_POOL)
      if (used.has(s)) continue
      used.add(s)
      insertSkill.run([uid, s, rand(['offer','seek','both']), rand(['Básico','Intermédio','Avançado'])])
    }
    const nInt = randInt(1, 3)
    const usedI = new Set()
    for (let i = 0; i < nInt; i++) {
      const it = rand(INTERESTS_POOL)
      if (usedI.has(it)) continue
      usedI.add(it)
      insertInterest.run([uid, it])
    }
  }
  insertSkill.free()
  insertInterest.free()

  // ---- Conversas + mensagens ----
  const insertConv = db.prepare(
    `INSERT INTO conversations (user_a,user_b,last_message,last_message_at) VALUES (?,?,?,datetime('now'))`
  )
  const insertMsg = db.prepare(
    `INSERT INTO messages (conversation_id,sender_id,type,content,status,created_at) VALUES (?,?,?,?,?,datetime('now'))`
  )

  for (let i = 1; i <= 6; i++) {
    const a = userIds[0]
    const b = userIds[i]
    insertConv.run([a, b, 'Olá! Podemos trocar conhecimentos?'])
    const convId = db.exec('SELECT last_insert_rowid() AS id')[0].values[0][0]
    insertMsg.run([convId, b, 'text', 'Olá! Vi que ofereces JavaScript. Podes ajudar-me?', 'read'])
    insertMsg.run([convId, a, 'text', 'Claro! Em troca gostava de aprender Design.', 'read'])
    insertMsg.run([convId, b, 'text', 'Combinado! Quando podemos começar?', 'delivered'])
  }
  insertConv.free()
  insertMsg.free()

  // ---- Pedidos de troca ----
  const insertReq = db.prepare(
    `INSERT INTO exchange_requests (requester_id,provider_id,skill,message,status) VALUES (?,?,?,?,?)`
  )
  for (let i = 1; i <= 8; i++) {
    insertReq.run([
      userIds[0], userIds[i], rand(SKILLS_POOL),
      'Gostaria de trocar conhecimentos contigo.',
      rand(['pending','accepted','running','completed'])
    ])
  }
  // Pedidos recebidos pelo utilizador demo
  for (let i = 3; i <= 5; i++) {
    insertReq.run([
      userIds[i], userIds[0], rand(SKILLS_POOL),
      'Olá! Vi o teu perfil e gostaria de aprender contigo.',
      'pending'
    ])
  }
  insertReq.free()

  // ---- Matches iniciais ----
  const insertMatch = db.prepare(
    `INSERT INTO matches (user_a,user_b,score,status) VALUES (?,?,?,?)`
  )
  for (let i = 1; i <= 4; i++) {
    insertMatch.run([Math.min(userIds[0], userIds[i]), Math.max(userIds[0], userIds[i]), 85 + i * 3, 'matched'])
  }
  insertMatch.free()

  // ---- Notificações ----
  const insertNotif = db.prepare(
    `INSERT INTO notifications (user_id,type,title,body,read) VALUES (?,?,?,?,?)`
  )
  const notifs = [
    ['match','Novo match!','Tens um novo match com um estudante.'],
    ['exchange','Pedido de troca','Recebeste um novo pedido de troca.'],
    ['message','Nova mensagem','Tens uma nova mensagem por ler.'],
    ['review','Nova avaliação','Recebeste uma avaliação de 5 estrelas.']
  ]
  for (let i = 0; i < 6; i++) {
    const n = rand(notifs)
    insertNotif.run([userIds[0], n[0], n[1], n[2], Math.random() > 0.5 ? 1 : 0])
  }
  insertNotif.free()
}
