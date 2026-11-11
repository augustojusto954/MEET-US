// backend/src/seeds/seedData.js
const bcrypt = require('bcryptjs');
const { User, Exchange, Conversation, Message, Match, Notification, Post, Session } = require('../models');

// Fotografias reais de alta qualidade de estudantes e jovens negros universitários moçambicanos (Unsplash)
const BLACK_STUDENTS_AVATARS = [
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces', // Edson (Demo) - Estudante negro sorridente
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', // Amália - Estudante negra UEM
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces', // Carlos - Estudante negro ISCTEM
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces', // Lúcia - Estudante negra UP
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces', // Hélder - Estudante negro UEM
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces', // Quitéria - Estudante negra UniSave
  'https://images.unsplash.com/photo-1520451644838-906a72aa7c86?w=400&h=400&fit=crop&crop=faces', // Inácio - Estudante negro ISCTEM
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces', // Samira - Estudante negra UEM
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=400&fit=crop&crop=faces', // Nelson - Estudante negro Politécnica
  'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400&h=400&fit=crop&crop=faces', // Yara - Estudante negra Arquitetura
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&h=400&fit=crop&crop=faces', // Zacarias - Estudante negro Medicina
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces', // Belmira - Estudante negra Direito
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces', // Mateus - Estudante negro Engenharia
  'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=400&h=400&fit=crop&crop=faces', // Tânia - Estudante negra Letras
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop&crop=faces', // Félix - Estudante negro UniZambeze
  'https://images.unsplash.com/photo-1561406636-b80293969660?w=400&h=400&fit=crop&crop=faces', // Neusa - Estudante negra UniLúrio
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=faces', // Arlindo - Estudante negro Mecânica
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=faces'  // Graça - Estudante negra Recursos Humanos
];

const SKILLS_POOL = [
  'JavaScript & Vue.js', 'Python para Análise de Dados', 'Design UI/UX no Figma',
  'Excel Avançado & Dashboards', 'Cálculo I & II', 'Álgebra Linear',
  'Inglês para Conversação', 'Francês para Relações Internacionais', 'Marketing Digital',
  'Direito Constitucional Moçambicano', 'Contabilidade & Fiscalidade',
  'Desenvolvimento Web Frontend', 'Estatística e Probabilidades', 'Fotografia & Edição',
  'Redação Académica & Teses', 'Gestão de Projetos Ágeis'
];

const INTERESTS_POOL = [
  'Tecnologia & Inovação', 'Empreendedorismo', 'Música Moçambicana',
  'Educação & Mentoria', 'Leitura & Literatura', 'Desporto Universitário',
  'Gaming & Esports', 'Cinema', 'Voluntariado Social', 'Inteligência Artificial'
];

const INSTITUTIONS = [
  'Universidade Eduardo Mondlane',
  'Universidade Pedagógica',
  'ISCTEM',
  'Universidade Save',
  'A Politécnica',
  'Universidade Zambeze',
  'Universidade Lúrio'
];

const MOZ_STUDENTS_SEED = [
  {
    _id: '1',
    name: 'Edson Mondlane',
    email: 'demo@meetus.mz',
    avatar: BLACK_STUDENTS_AVATARS[0],
    bio: 'Estudante do 3º ano de Engenharia Informática na UEM. Apaixonado por desenvolvimento frontend com Vue.js e por trocar conhecimentos com colegas.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Engenharia Informática',
    year: 3,
    city: 'Maputo',
    availability: 'Terças e Quintas (15h - 19h), Sábados de manhã',
    reputation: 4.9,
    reviews_count: 24,
    verified: true,
    online: false,
    skills: [
      { name: 'JavaScript & Vue.js', type: 'offer', level: 'Avançado' },
      { name: 'Git & GitHub', type: 'offer', level: 'Avançado' },
      { name: 'Design UI/UX no Figma', type: 'seek', level: 'Básico' },
      { name: 'Inglês para Conversação', type: 'seek', level: 'Intermédio' }
    ],
    interests: ['Tecnologia & Inovação', 'Inteligência Artificial', 'Empreendedorismo', 'Música Moçambicana']
  },
  {
    _id: '2',
    name: 'Amália Mabjaia',
    email: 'amalia.mabjaia@uem.mz',
    avatar: BLACK_STUDENTS_AVATARS[1],
    bio: 'Estudante do 4º ano de Design de Comunicação na UEM. Especialista em design systems no Figma e prototipagem. Quero dominar lógica de front-end!',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Design de Comunicação',
    year: 4,
    city: 'Maputo',
    availability: 'Segundas, Quartas e Sextas à tarde',
    reputation: 5.0,
    reviews_count: 38,
    verified: true,
    online: false,
    skills: [
      { name: 'Design UI/UX no Figma', type: 'offer', level: 'Avançado' },
      { name: 'Fotografia & Edição', type: 'offer', level: 'Avançado' },
      { name: 'JavaScript & Vue.js', type: 'seek', level: 'Iniciante' }
    ],
    interests: ['Design UI/UX no Figma', 'Educação & Mentoria', 'Fotografia & Edição']
  },
  {
    _id: '3',
    name: 'Carlos Cossa',
    email: 'carlos.cossa@isctem.ac.mz',
    avatar: BLACK_STUDENTS_AVATARS[2],
    bio: 'Estudante de Gestão de Empresas no ISCTEM. Prático em modelagem financeira no Excel, dashboards e pitch decks para startups locais.',
    institution: 'ISCTEM',
    course: 'Gestão de Empresas',
    year: 3,
    city: 'Maputo',
    availability: 'Tardes de Terça e Quinta, Fins de semana',
    reputation: 4.8,
    reviews_count: 19,
    verified: true,
    online: false,
    skills: [
      { name: 'Excel Avançado & Dashboards', type: 'offer', level: 'Avançado' },
      { name: 'Contabilidade & Fiscalidade', type: 'offer', level: 'Intermédio' },
      { name: 'Python para Análise de Dados', type: 'seek', level: 'Iniciante' }
    ],
    interests: ['Empreendedorismo', 'Educação & Mentoria', 'Desporto Universitário']
  },
  {
    _id: '4',
    name: 'Lúcia Nhaca',
    email: 'lucia.nhaca@up.ac.mz',
    avatar: BLACK_STUDENTS_AVATARS[3],
    bio: 'Estudante de Ensino de Inglês na UP. Fluente C2. Apoio colegas com pronúncia, conversação fluente e redação de artigos académicos.',
    institution: 'Universidade Pedagógica',
    course: 'Ensino de Língua Inglesa',
    year: 4,
    city: 'Maputo',
    availability: 'Manhãs de Segunda e Quarta, Sábados',
    reputation: 4.95,
    reviews_count: 42,
    verified: true,
    online: false,
    skills: [
      { name: 'Inglês para Conversação', type: 'offer', level: 'Avançado' },
      { name: 'Redação Académica & Teses', type: 'offer', level: 'Avançado' },
      { name: 'Marketing Digital', type: 'seek', level: 'Iniciante' }
    ],
    interests: ['Leitura & Literatura', 'Educação & Mentoria', 'Voluntariado Social']
  },
  {
    _id: '5',
    name: 'Hélder Tembe',
    email: 'helder.tembe@uem.mz',
    avatar: BLACK_STUDENTS_AVATARS[4],
    bio: 'Estudante de Física e Matemática na UEM. Apaixonado por Cálculo I, II e Álgebra Linear. Quer aprender desenvolvimento web.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Física Aplicada & Matemática',
    year: 2,
    city: 'Maputo',
    availability: 'Todos os dias a partir das 18h',
    reputation: 4.7,
    reviews_count: 15,
    verified: true,
    online: false,
    skills: [
      { name: 'Cálculo I & II', type: 'offer', level: 'Avançado' },
      { name: 'Álgebra Linear', type: 'offer', level: 'Avançado' },
      { name: 'JavaScript & Vue.js', type: 'seek', level: 'Iniciante' }
    ],
    interests: ['Tecnologia & Inovação', 'Inteligência Artificial', 'Leitura & Literatura']
  },
  {
    _id: '6',
    name: 'Quitéria Bila',
    email: 'quiteria.bila@unisave.ac.mz',
    avatar: BLACK_STUDENTS_AVATARS[5],
    bio: 'Estudante na UniSave Gaza. Especialista em redação para comunicação social, fotografia documental e oratória.',
    institution: 'Universidade Save',
    course: 'Comunicação Social',
    year: 3,
    city: 'Chongoene',
    availability: 'Sextas e Fins de semana',
    reputation: 4.88,
    reviews_count: 21,
    verified: true,
    online: false,
    skills: [
      { name: 'Fotografia & Edição', type: 'offer', level: 'Avançado' },
      { name: 'Marketing Digital', type: 'seek', level: 'Iniciante' }
    ],
    interests: ['Fotografia & Edição', 'Música Moçambicana', 'Voluntariado Social']
  }
];

async function seedDatabase(force = false) {
  const existingUsers = await User.find({});
  const hasOutdatedAvatars = existingUsers.some(u => u.avatar && u.avatar.includes('pravatar'));

  if (!force && existingUsers.length >= 6 && !hasOutdatedAvatars) {
    console.log(`[Seed] Database already contains ${existingUsers.length} verified Mozambican users. Skipping seed.`);
    return;
  }

  console.log('[Seed] Seeding database with genuine Mozambican university students & authentic Black portraits...');

  // Se necessário limpar dados antigos com avatares de IA ou incorretos
  if (hasOutdatedAvatars || force) {
    await User.deleteMany({});
    await Exchange.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Post.deleteMany({});
    await Match.deleteMany({});
    console.log('[Seed] Cleared legacy collections for clean Mozambican database.');
  }

  // Palavras-passe em texto limpo — o pre-save hook do Mongoose faz o hash automaticamente
  const createdUsers = [];

  for (const s of MOZ_STUDENTS_SEED) {
    const password = s.email === 'demo@meetus.mz' ? 'demo1234' : 'password123';
    const u = await User.create({
      ...s,
      role: 'student',
      password
    });
    createdUsers.push(u);
  }

  // Criar Administrador Oficial do Sistema MEET-US
  const adminUser = await User.create({
    _id: 'admin-001',
    name: 'Administrador MEET-US',
    email: 'admin@meetus.mz',
    password: 'admin1234',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
    bio: 'Administrador Geral da Plataforma MEET-US. Gestão global de estudantes, universidades, cursos, categorias e moderação.',
    institution: 'Administração Geral MEET-US',
    course: 'Gestão de Sistemas de Informação',
    year: 5,
    city: 'Maputo',
    verified: true
  });
  console.log('[Seed] Official Admin account seeded: admin@meetus.mz / admin1234');

  // Criar mais estudantes moçambicanos para enriquecer o matching e diretório
  const EXTRA_NAMES = [
    { name: 'Inácio Matusse', gender: 'm', course: 'Engenharia Informática', institution: 'ISCTEM', city: 'Maputo', imgIdx: 6 },
    { name: 'Samira Mucavele', gender: 'f', course: 'Economia', institution: 'Universidade Eduardo Mondlane', city: 'Maputo', imgIdx: 7 },
    { name: 'Nelson Macuácua', gender: 'm', course: 'Contabilidade e Finanças', institution: 'A Politécnica', city: 'Maputo', imgIdx: 8 },
    { name: 'Yara Sitóe', gender: 'f', course: 'Arquitetura e Planeamento', institution: 'Universidade Eduardo Mondlane', city: 'Maputo', imgIdx: 9 },
    { name: 'Zacarias Zandamela', gender: 'm', course: 'Medicina Geral', institution: 'Universidade Eduardo Mondlane', city: 'Maputo', imgIdx: 10 },
    { name: 'Belmira Guambe', gender: 'f', course: 'Direito', institution: 'ISCTEM', city: 'Maputo', imgIdx: 11 },
    { name: 'Mateus Langa', gender: 'm', course: 'Engenharia Electrotécnica', institution: 'Universidade Eduardo Mondlane', city: 'Maputo', imgIdx: 12 },
    { name: 'Tânia Chissano', gender: 'f', course: 'Ensino de Francês', institution: 'Universidade Pedagógica', city: 'Maputo', imgIdx: 13 },
    { name: 'Félix Sumbane', gender: 'm', course: 'Agronomia', institution: 'Universidade Zambeze', city: 'Beira', imgIdx: 14 },
    { name: 'Neusa Magaia', gender: 'f', course: 'Ciências Biológicas', institution: 'Universidade Lúrio', city: 'Nampula', imgIdx: 15 },
    { name: 'Arlindo Muianga', gender: 'm', course: 'Engenharia Mecânica', institution: 'Universidade Eduardo Mondlane', city: 'Maputo', imgIdx: 16 },
    { name: 'Graça Ndlovu', gender: 'f', course: 'Gestão de Recursos Humanos', institution: 'A Politécnica', city: 'Quelimane', imgIdx: 17 }
  ];

  for (let i = 0; i < EXTRA_NAMES.length; i++) {
    const item = EXTRA_NAMES[i];
    const emailName = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '.');
    const u = await User.create({
      _id: String(i + 7),
      name: item.name,
      email: `${emailName}@meetus.mz`,
      password: 'password123',
      avatar: BLACK_STUDENTS_AVATARS[item.imgIdx % BLACK_STUDENTS_AVATARS.length],
      bio: `Estudante de ${item.course} na ${item.institution}. Empenhado em aprender novas ferramentas e partilhar a minha experiência com colegas.`,
      institution: item.institution,
      course: item.course,
      year: Math.floor(Math.random() * 4) + 1,
      city: item.city,
      availability: 'Tardes e fins de semana',
      reputation: +(Math.random() * 0.8 + 4.2).toFixed(1),
      reviews_count: Math.floor(Math.random() * 25) + 5,
      verified: true,
      online: false,
      skills: [
        { name: SKILLS_POOL[i % SKILLS_POOL.length], type: 'offer', level: 'Avançado' },
        { name: SKILLS_POOL[(i + 3) % SKILLS_POOL.length], type: 'seek', level: 'Intermédio' }
      ],
      interests: ['Tecnologia & Inovação', 'Educação & Mentoria', 'Empreendedorismo']
    });
    createdUsers.push(u);
  }

  // Conversas Reais no Chat para o utilizador demo
  const demoUser = createdUsers[0];
  for (let i = 1; i <= 3; i++) {
    const peer = createdUsers[i];
    const conv = await Conversation.create({
      _id: String(i),
      user_a: demoUser.id,
      user_b: peer.id,
      last_message: i === 1 ? 'Perfeito! Já preparei o ficheiro do Figma para a nossa sessão de sexta-feira.' : 'Muito obrigado pela sessão de estudo!',
      last_message_at: new Date(Date.now() - i * 1800000).toISOString()
    });

    await Message.create({
      conversation_id: conv.id,
      sender_id: peer.id,
      type: 'text',
      content: `Olá ${demoUser.name.split(' ')[0]}! Vi que ensinas ${demoUser.skills[0].name}. Podes ajudar-me no projeto semestral?`,
      status: 'read'
    });

    await Message.create({
      conversation_id: conv.id,
      sender_id: demoUser.id,
      type: 'text',
      content: 'Com certeza! E tu podes ensinar-me um pouco da tua matéria?',
      status: 'read'
    });

    await Message.create({
      conversation_id: conv.id,
      sender_id: peer.id,
      type: 'text',
      content: i === 1 ? 'Perfeito! Já preparei o ficheiro do Figma para a nossa sessão de sexta-feira.' : 'Muito obrigado pela sessão de estudo!',
      status: 'delivered'
    });
  }

  // Pedidos de Troca Reais
  const exchangeTemplates = [
    { partnerIdx: 1, skillG: 'JavaScript & Vue.js', skillR: 'Design UI/UX no Figma', status: 'accepted', goal: 'Construção de Design System no Figma e programação dos componentes em Vue.js' },
    { partnerIdx: 3, skillG: 'Git & GitHub', skillR: 'Inglês para Conversação', status: 'running', goal: 'Simulação de entrevista técnica em inglês para vaga de estágio' },
    { partnerIdx: 2, skillG: 'Introdução a JavaScript', skillR: 'Excel Avançado & Dashboards', status: 'completed', goal: 'Aprender XLOOKUP e fórmulas dinâmicas para relatórios financeiros' },
    { partnerIdx: 4, skillG: 'Git & GitHub', skillR: 'Cálculo I & II', status: 'pending', goal: 'Resolução conjunta da lista de exercícios de integrais' }
  ];

  for (let i = 0; i < exchangeTemplates.length; i++) {
    const t = exchangeTemplates[i];
    const peer = createdUsers[t.partnerIdx];
    await Exchange.create({
      _id: String(i + 1),
      requester_id: demoUser.id,
      provider_id: peer.id,
      skill: t.skillR,
      message: t.goal,
      status: t.status,
      scheduled_at: new Date(Date.now() + (i + 1) * 86400000).toISOString()
    });
  }

  // Publicações Reais da Comunidade Moçambicana
  await Post.create({
    _id: 'post-1',
    author_id: '2',
    author_name: 'Amália Mabjaia',
    author_avatar: BLACK_STUDENTS_AVATARS[1],
    author_course: 'Design de Comunicação',
    author_institution: 'Universidade Eduardo Mondlane',
    title: 'Dica rápida para quem está a criar o primeiro Design System no Figma 🎨',
    content: 'Olá colegas da UEM e de todas as universidades! Muitos colegas perguntam por onde começar a organizar tokens de cor no Figma. Recomendo definirem primeiro nomes semânticos (ex: primary-base, surface-subtle) antes de valores hexadecimais soltos. Quem quiser fazer uma sessão de 45min prática em troca de uma introdução a TypeScript ou Vue.js, envie mensagem!',
    category: 'Design & Multimédia',
    tags: ['Figma', 'UIUX', 'UEM', 'DesignSystem'],
    likes: ['1', '3', '4'],
    likes_count: 28,
    comments: [
      {
        author_id: '1',
        author_name: 'Edson Mondlane',
        author_avatar: BLACK_STUDENTS_AVATARS[0],
        text: 'Excelente dica Amália! Estou super interessado em trocar Vue.js por essa mentoria de tokens no Figma.',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  });

  await Post.create({
    _id: 'post-2',
    author_id: '4',
    author_name: 'Lúcia Nhaca',
    author_avatar: BLACK_STUDENTS_AVATARS[3],
    author_course: 'Ensino de Língua Inglesa',
    author_institution: 'Universidade Pedagógica',
    title: 'Sessão de Conversação em Inglês: Simulação de Entrevistas de Estágio 🎙️',
    content: 'Vou abrir 3 vagas esta semana para estudantes que tenham entrevistas técnicas ou apresentações académicas em inglês. Focamos em vocabulário profissional, entonação e clareza. Quem tiver competências em Marketing ou Python e quiser trocar, vamos conectar!',
    category: 'Línguas & Comunicação',
    tags: ['Inglês', 'Carreira', 'Speaking', 'UPMaputo'],
    likes: ['1', '2', '5'],
    likes_count: 35,
    comments: []
  });

  await Post.create({
    _id: 'post-3',
    author_id: '5',
    author_name: 'Hélder Tembe',
    author_avatar: BLACK_STUDENTS_AVATARS[4],
    author_course: 'Física Aplicada & Matemática',
    author_institution: 'Universidade Eduardo Mondlane',
    title: 'Dúvidas em Cálculo II? Entenda a geometria antes de decorar fórmulas!',
    content: 'Muitos estudantes chumbam em integrais duplas e triplas porque decoram fórmulas em vez de desenhar a projeção da região no plano xy. Preparei um resumo ilustrado de 4 páginas com exercícios resolvidos dos testes da UEM. Disponível para quem quiser estudar juntos!',
    category: 'Ciências & Matemática',
    tags: ['Cálculo', 'Matemática', 'Física', 'UEM'],
    likes: ['1', '3'],
    likes_count: 42,
    comments: []
  });

  // Seed Sessions (Aulas em Directo / Live Sessions)
  try {
    const existingSessions = await Session.countDocuments();
    if (existingSessions === 0) {
      await Session.create({
        _id: 'session-1',
        title: 'Inglês com Lúcia',
        subject: 'Inglês para Conversação Académica',
        description: 'Prática de conversação fluente, vocabulário técnico e pronúncia para entrevistas e apresentações internacionais.',
        host_id: '4',
        host_name: 'Lúcia Nhaca',
        host_avatar: BLACK_STUDENTS_AVATARS[3],
        host_course: 'Ensino de Língua Inglesa (UP)',
        status: 'SCHEDULED', // AGENDADA
        scheduled_at: '2026-11-11T10:00:00.000Z',
        started_at: null,
        ended_at: null,
        max_participants: 30,
        participants: [
          {
            user_id: '1',
            user_name: 'Edson Arnaldo',
            user_avatar: BLACK_STUDENTS_AVATARS[0],
            user_course: 'Engenharia Informática',
            status: 'JOINED',
            joined_at: new Date().toISOString()
          },
          {
            user_id: '2',
            user_name: 'Amália Mabjaia',
            user_avatar: BLACK_STUDENTS_AVATARS[1],
            user_course: 'Design e Multimédia',
            status: 'JOINED',
            joined_at: new Date().toISOString()
          },
          {
            user_id: '8',
            user_name: 'Samira Patel',
            user_avatar: BLACK_STUDENTS_AVATARS[7],
            user_course: 'Medicina Geral',
            status: 'JOINED',
            joined_at: new Date().toISOString()
          },
          {
            user_id: '3',
            user_name: 'Carlos Macuácua',
            user_avatar: BLACK_STUDENTS_AVATARS[2],
            user_course: 'Gestão Financeira',
            status: 'JOINED',
            joined_at: new Date().toISOString()
          }
        ],
        chat_messages: [
          {
            sender_id: '4',
            sender_name: 'Lúcia Nhaca',
            sender_avatar: BLACK_STUDENTS_AVATARS[3],
            text: 'Olá a todos! Sejam bem-vindos à nossa aula em directo de Inglês.',
            time: '10:01'
          }
        ]
      });

      await Session.create({
        _id: 'session-2',
        title: 'Programação Web com Vue 3 & Quasar',
        subject: 'Engenharia de Software',
        description: 'Construção de componentes reativos, stores Pinia, PWA e integração WebSockets em tempo real.',
        host_id: '1',
        host_name: 'Edson Arnaldo',
        host_avatar: BLACK_STUDENTS_AVATARS[0],
        host_course: 'Engenharia Informática (UP)',
        status: 'SCHEDULED',
        scheduled_at: '2026-11-11T15:30:00.000Z',
        started_at: null,
        ended_at: null,
        max_participants: 25,
        participants: []
      });

      await Session.create({
        _id: 'session-3',
        title: 'Cálculo I: Teorema Fundamental e Integrais',
        subject: 'Matemática e Engenharia',
        description: 'Resolução passo a passo de exercícios práticos dos exames de admissão e testes semestrais.',
        host_id: '5',
        host_name: 'Hélder Tembe',
        host_avatar: BLACK_STUDENTS_AVATARS[4],
        host_course: 'Física Aplicada & Matemática (UEM)',
        status: 'ENDED',
        scheduled_at: '2026-11-10T14:00:00.000Z',
        started_at: '2026-11-10T14:02:00.000Z',
        ended_at: '2026-11-10T15:35:00.000Z',
        max_participants: 40,
        participants: [
          {
            user_id: '1',
            user_name: 'Edson Arnaldo',
            user_avatar: BLACK_STUDENTS_AVATARS[0],
            status: 'JOINED'
          }
        ]
      });
      console.log('[Seed] Live Sessions seeded successfully.');
    }
  } catch (err) {
    console.warn('[Seed] Warning seeding sessions:', err.message);
  }

  console.log(`[Seed] Seed finished successfully! 18 authentic Mozambican students and full real content loaded.`);
}

module.exports = { seedDatabase };
