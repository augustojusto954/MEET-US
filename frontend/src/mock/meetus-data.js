// frontend/src/mock/meetus-data.js
// Centralized mock data and store state for MEET-US platform

export const INITIAL_UNIVERSITIES = [
  { id: '1', name: 'Universidade Eduardo Mondlane', acronym: 'UEM', city: 'Maputo', campus: 'Campus Principal', studentsCount: 1420, verified: true },
  { id: '2', name: 'Universidade Pedagógica', acronym: 'UP', city: 'Maputo', campus: 'Campus Central', studentsCount: 980, verified: true },
  { id: '3', name: 'Instituto Superior de Ciências e Tecnologia de Moçambique', acronym: 'ISCTEM', city: 'Maputo', campus: 'Campus 24 de Julho', studentsCount: 650, verified: true },
  { id: '4', name: 'Universidade Save', acronym: 'UniSave', city: 'Chongoene', campus: 'Sede Chongoene', studentsCount: 430, verified: true },
  { id: '5', name: 'Universidade Politécnica', acronym: 'A Politécnica', city: 'Maputo', campus: 'Campus Politec', studentsCount: 520, verified: true },
  { id: '6', name: 'Universidade Zambeze', acronym: 'UniZambeze', city: 'Beira', campus: 'Campus Beira', studentsCount: 390, verified: true },
  { id: '7', name: 'Universidade Lúrio', acronym: 'UniLúrio', city: 'Nampula', campus: 'Campus Marrere', studentsCount: 310, verified: true }
]

export const INITIAL_FACULTIES = [
  { id: '1', universityId: '1', name: 'Faculdade de Engenharia', dean: 'Prof. Dr. M. Mabjaia', coursesCount: 8 },
  { id: '2', universityId: '1', name: 'Faculdade de Ciências', dean: 'Dra. S. Mondlane', coursesCount: 6 },
  { id: '3', universityId: '1', name: 'Faculdade de Economia', dean: 'Prof. C. Santos', coursesCount: 5 },
  { id: '4', universityId: '2', name: 'Faculdade de Ciências Naturais e Matemática', dean: 'Dr. F. Cossa', coursesCount: 4 },
  { id: '5', universityId: '3', name: 'Faculdade de Informática e Tecnologias', dean: 'Eng. J. Tembe', coursesCount: 5 }
]

export const INITIAL_COURSES = [
  { id: '1', facultyId: '1', universityId: '1', name: 'Engenharia Informática', degree: 'Licenciatura', durationYears: 4 },
  { id: '2', facultyId: '1', universityId: '1', name: 'Engenharia Mecânica', degree: 'Licenciatura', durationYears: 5 },
  { id: '3', facultyId: '1', universityId: '1', name: 'Engenharia Civil', degree: 'Licenciatura', durationYears: 5 },
  { id: '4', facultyId: '2', universityId: '1', name: 'Ciência da Computação', degree: 'Licenciatura', durationYears: 4 },
  { id: '5', facultyId: '3', universityId: '1', name: 'Gestão de Empresas', degree: 'Licenciatura', durationYears: 4 },
  { id: '6', facultyId: '3', universityId: '1', name: 'Contabilidade e Finanças', degree: 'Licenciatura', durationYears: 4 },
  { id: '7', facultyId: '5', universityId: '3', name: 'Design Gráfico e Multimédia', degree: 'Licenciatura', durationYears: 3 },
  { id: '8', facultyId: '5', universityId: '3', name: 'Engenharia de Redes e Telecomunicações', degree: 'Licenciatura', durationYears: 4 }
]

export const INITIAL_SKILL_CATEGORIES = [
  { id: 'cat-1', name: 'Programação & Tech', icon: 'code', count: 48, description: 'Desenvolvimento Web, Mobile, Data Science e Algoritmos' },
  { id: 'cat-2', name: 'Design & Multimédia', icon: 'palette', count: 32, description: 'UI/UX, Edição de Vídeo, Modelagem 3D, Ilustração' },
  { id: 'cat-3', name: 'Negócios & Gestão', icon: 'trending_up', count: 26, description: 'Marketing Digital, Empreendedorismo, Finanças, Pitching' },
  { id: 'cat-4', name: 'Línguas & Comunicação', icon: 'translate', count: 19, description: 'Inglês, Francês, Espanhol, Oratória, Redação Académica' },
  { id: 'cat-5', name: 'Ciências & Matemática', icon: 'calculate', count: 35, description: 'Cálculo, Álgebra Linear, Física, Estatística, Química' },
  { id: 'cat-6', name: 'Música & Artes', icon: 'music_note', count: 14, description: 'Violão, Piano, Fotografia, Produção Musical' }
]

export const INITIAL_STUDENTS = [
  {
    id: '1',
    name: 'Edson Mondlane',
    email: 'demo@meetus.mz',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
    bio: 'Estudante de Engenharia Informática na UEM. Apaixonado por desenvolvimento frontend, Vue.js e por trocar conhecimentos práticos com colegas moçambicanos!',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Engenharia Informática',
    year: 3,
    city: 'Maputo',
    availability: 'Terças e Quintas (15h - 19h), Sábados de manhã',
    reputation: 4.9,
    reviews_count: 24,
    verified: true,
    online: true,
    skillsTeach: [
      { id: 'st-1', name: 'Vue.js & Quasar', level: 'Avançado', category: 'Programação & Tech', experience: '3 anos', description: 'Criação de SPAs modernas e interfaces reativas' },
      { id: 'st-2', name: 'JavaScript Moderno', level: 'Avançado', category: 'Programação & Tech', experience: '3 anos', description: 'ES6+, Promises, Async/Await e manipulação DOM' },
      { id: 'st-3', name: 'Git & GitHub', level: 'Intermédio', category: 'Programação & Tech', experience: '2 anos', description: 'Controlo de versões, branches, merges e PRs' }
    ],
    skillsLearn: [
      { id: 'sl-1', name: 'UI/UX Design no Figma', level: 'Básico', category: 'Design & Multimédia', priority: 'Alta', goal: 'Aprender prototipagem e design systems' },
      { id: 'sl-2', name: 'Inglês para Conversação', level: 'Intermédio', category: 'Línguas & Comunicação', priority: 'Média', goal: 'Praticar fluência para entrevistas técnicas' },
      { id: 'sl-3', name: 'Estatística Aplicada', level: 'Iniciante', category: 'Ciências & Matemática', priority: 'Média', goal: 'Preparação para exame semestral' }
    ],
    interests: ['Tecnologia & Inovação', 'Inteligência Artificial', 'Empreendedorismo', 'Música Moçambicana'],
    privacy: { publicProfile: true, showUniversity: true, showAvailability: true, allowMessagesFrom: 'everyone' }
  },
  {
    id: '2',
    name: 'Amélia Mondlane',
    email: 'amelia.mondlane@uem.mz',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
    bio: 'Estudante de Engenharia Informática na UEM. Especialista em Design de Interfaces e React. Quero praticar Inglês e aprender Fotografia!',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Engenharia Informática',
    year: 4,
    city: 'Maputo',
    availability: 'Segundas, Quartas e Sextas à tarde',
    reputation: 4.9,
    reviews_count: 28,
    verified: true,
    online: true,
    compatibilityScore: 94,
    skillsTeach: [
      { id: 'st-201', name: 'Design de Interfaces', level: 'Especialista', category: 'Design & Multimédia', experience: '4 anos', description: 'Design UI/UX e protótipos interativos' },
      { id: 'st-202', name: 'React', level: 'Avançado', category: 'Programação & Tech', experience: '3 anos', description: 'Desenvolvimento frontend moderno com componentes' }
    ],
    skillsLearn: [
      { id: 'sl-201', name: 'Inglês', level: 'Intermédio', category: 'Línguas & Comunicação', priority: 'Alta', goal: 'Fluência em conversação' },
      { id: 'sl-202', name: 'Fotografia', level: 'Iniciante', category: 'Música & Artes', priority: 'Alta', goal: 'Aprender composição e luz' }
    ],
    interests: ['Design UI/UX no Figma', 'Educação & Mentoria', 'Fotografia & Edição', 'Música Moçambicana']
  },
  {
    id: '3',
    name: 'Celso Macuácua',
    email: 'celso.macuacua@uem.mz',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
    bio: 'Estudante de Gestão e Administração em Matola. Especialista em Excel Avançado e Contabilidade.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Gestão e Administração',
    year: 3,
    city: 'Matola',
    availability: 'Tardes de Terça e Quinta, Fins de semana',
    reputation: 4.9,
    reviews_count: 38,
    verified: true,
    online: true,
    compatibilityScore: 92,
    skillsTeach: [
      { id: 'st-301', name: 'Excel', level: 'Avançado', category: 'Negócios & Gestão', experience: '3 anos', description: 'Modelagem financeira e tabelas dinâmicas' },
      { id: 'st-302', name: 'Contabilidade', level: 'Intermédio', category: 'Negócios & Gestão', experience: '2 anos', description: 'Balanços e demonstrações financeiras' }
    ],
    skillsLearn: [
      { id: 'sl-301', name: 'Design de Interfaces', level: 'Iniciante', category: 'Design & Multimédia', priority: 'Alta', goal: 'Criar layouts e wireframes' },
      { id: 'sl-302', name: 'Inglês', level: 'Iniciante', category: 'Línguas & Comunicação', priority: 'Média', goal: 'Conversação básica' }
    ],
    interests: ['Empreendedorismo', 'Economia', 'Basquetebol', 'Música Moçambicana']
  },
  {
    id: '4',
    name: 'Neusa Tembe',
    email: 'neusa.tembe@unizambeze.ac.mz',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=400&fit=crop',
    bio: 'Estudante de Contabilidade e Auditoria na Beira. Ensino Contabilidade e Excel. Quero aprender React e Fotografia.',
    institution: 'Universidade Zambeze',
    course: 'Contabilidade e Auditoria',
    year: 4,
    city: 'Beira',
    availability: 'Manhãs de Segunda e Quarta, Sábados',
    reputation: 4.9,
    reviews_count: 22,
    verified: true,
    online: true,
    compatibilityScore: 91,
    skillsTeach: [
      { id: 'st-401', name: 'Contabilidade', level: 'Especialista', category: 'Negócios & Gestão', experience: '4 anos', description: 'Auditoria e relatórios financeiros' },
      { id: 'st-402', name: 'Excel', level: 'Avançado', category: 'Negócios & Gestão', experience: '3 anos', description: 'Fórmulas avançadas e automação' }
    ],
    skillsLearn: [
      { id: 'sl-401', name: 'React', level: 'Iniciante', category: 'Programação & Tech', priority: 'Alta', goal: 'Construir aplicações web' },
      { id: 'sl-402', name: 'Fotografia', level: 'Iniciante', category: 'Música & Artes', priority: 'Média', goal: 'Técnicas de fotografia' }
    ],
    interests: ['Línguas', 'Leitura & Literatura', 'Educação & Mentoria', 'Voluntariado Social']
  },
  {
    id: '5',
    name: 'Lúcia Armando',
    email: 'lucia.armando@uem.mz',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
    bio: 'Estudante de Engenharia Civil na UEM. Cálculo Estrutural e AutoCAD.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Engenharia Civil',
    year: 3,
    city: 'Maputo',
    availability: 'Fins de semana',
    reputation: 4.8,
    reviews_count: 15,
    verified: true,
    online: true,
    compatibilityScore: 88,
    skillsTeach: [
      { id: 'st-501', name: 'AutoCAD', level: 'Avançado', category: 'Design & Multimédia', experience: '2 anos', description: 'Desenho arquitetónico e estrutural' }
    ],
    skillsLearn: [
      { id: 'sl-501', name: 'Excel', level: 'Intermédio', category: 'Negócios & Gestão', priority: 'Alta', goal: 'Planilhas de orçamento' }
    ],
    interests: ['Engenharia', 'Arquitetura', 'Tecnologia']
  },
  {
    id: '6',
    name: 'Samuel Nantumbo',
    email: 'samuel.nantumbo@uem.mz',
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
    bio: 'Estudante de Economia na UEM. Análise Macro e Microeconómica, Estatística.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Economia',
    year: 3,
    city: 'Maputo',
    availability: 'Tardes de Quarta e Sexta',
    reputation: 4.7,
    reviews_count: 18,
    verified: true,
    online: true,
    compatibilityScore: 85,
    skillsTeach: [
      { id: 'st-601', name: 'Economia & Finanças', level: 'Avançado', category: 'Negócios & Gestão', experience: '3 anos', description: 'Análise de mercados e finanças' }
    ],
    skillsLearn: [
      { id: 'sl-601', name: 'Python para Dados', level: 'Iniciante', category: 'Programação & Tech', priority: 'Alta', goal: 'Econometria com Python' }
    ],
    interests: ['Finanças', 'Economia', 'Investimentos']
  },
  {
    id: '7',
    name: 'Marta Cossa',
    email: 'marta.cossa@isctem.ac.mz',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
    bio: 'Estudante de Direito no ISCTEM. Direito Civil, Comercial e Redação Jurídica.',
    institution: 'ISCTEM',
    course: 'Direito',
    year: 4,
    city: 'Maputo',
    availability: 'Manhãs de Terça e Quinta',
    reputation: 4.9,
    reviews_count: 25,
    verified: true,
    online: true,
    compatibilityScore: 82,
    skillsTeach: [
      { id: 'st-701', name: 'Direito & Contratos', level: 'Avançado', category: 'Línguas & Comunicação', experience: '3 anos', description: 'Revisão de contratos e pareceres jurídicos' }
    ],
    skillsLearn: [
      { id: 'sl-701', name: 'Oratória & Apresentações', level: 'Intermédio', category: 'Línguas & Comunicação', priority: 'Média', goal: 'Falar em público com confiança' }
    ],
    interests: ['Direito', 'Comunicação', 'Debate']
  },
  {
    id: '8',
    name: 'Samira Mucavele',
    email: 'samira.mucavele@meetus.mz',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=400&fit=crop',
    bio: 'Estudante de Economia na UEM. Apaixonada por econometria e análise de mercado em Moçambique.',
    institution: 'Universidade Eduardo Mondlane',
    course: 'Economia',
    year: 4,
    city: 'Maputo',
    availability: 'Terças e Quintas de manhã',
    reputation: 4.92,
    reviews_count: 27,
    verified: true,
    online: true,
    compatibilityScore: 90,
    skillsTeach: [
      { id: 'st-801', name: 'Econometria & Estatística', level: 'Avançado', category: 'Ciências & Matemática', experience: '3 anos', description: 'Modelos de regressão e séries temporais' }
    ],
    skillsLearn: [
      { id: 'sl-801', name: 'Python para Análise de Dados', level: 'Iniciante', category: 'Programação & Tech', priority: 'Alta', goal: 'Automatizar tratamentos estatísticos com Pandas' }
    ],
    interests: ['Economia', 'Empreendedorismo', 'Finanças']
  }
]

export const INITIAL_CONNECTIONS = [
  { id: 'conn-1', studentId: '2', status: 'connected', connectedSince: '2026-09-12', mutualConnections: 5 },
  { id: 'conn-2', studentId: '3', status: 'connected', connectedSince: '2026-10-01', mutualConnections: 3 },
  { id: 'conn-3', studentId: '4', status: 'connected', connectedSince: '2026-10-18', mutualConnections: 7 },
  { id: 'conn-4', studentId: '5', status: 'received', requestedAt: 'Há 2 horas', note: 'Olá! Vi que ensinas Vue.js, gostaria muito de trocar com Cálculo!' },
  { id: 'conn-5', studentId: '6', status: 'sent', requestedAt: 'Há 1 dia', note: 'Olá Quitéria, vi tuas fotos e gostaria de aprender composição!' }
]

export const INITIAL_EXCHANGES = [
  {
    id: 'exc-1',
    partnerId: '2',
    partnerName: 'Amália Mabjaia',
    partnerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
    partnerUniversity: 'UEM',
    partnerCourse: 'Design de Comunicação',
    skillGiven: 'Vue.js & Componentes Reativos',
    skillReceived: 'UI/UX Design no Figma',
    goal: 'Criar um Design System completo no Figma e programar a biblioteca de componentes em Vue.js',
    mode: 'Online (Sala de Estudo MEET-US)',
    scheduledDate: '2026-11-06',
    scheduledTime: '16:00 - 17:30',
    duration: '90 minutos',
    status: 'accepted',
    timeline: [
      { title: 'Proposta Enviada', date: '01 Nov 2026 14:20', done: true },
      { title: 'Pedido Aceite', date: '02 Nov 2026 10:15', done: true },
      { title: 'Sessão Agendada', date: '02 Nov 2026 10:20', done: true },
      { title: 'Sessão em Andamento', date: 'Aguardando data da sessão', done: false },
      { title: 'Conclusão e Avaliação', date: 'Pendente', done: false }
    ],
    notes: 'Preparar conta no Figma e ter o projeto Vue rodando no VSCode.'
  },
  {
    id: 'exc-2',
    partnerId: '4',
    partnerName: 'Lúcia Nhaca',
    partnerAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
    partnerUniversity: 'Universidade Pedagógica',
    partnerCourse: 'Ensino de Inglês',
    skillGiven: 'Git & Estrutura de Projetos',
    skillReceived: 'Inglês para Conversação Técnica',
    goal: 'Simular entrevista técnica em inglês para vaga de estágio internacional',
    mode: 'Online (Sala de Estudo MEET-US)',
    scheduledDate: '2026-11-08',
    scheduledTime: '10:00 - 11:00',
    duration: '60 minutos',
    status: 'running',
    timeline: [
      { title: 'Proposta Enviada', date: '28 Out 2026 18:00', done: true },
      { title: 'Pedido Aceite', date: '29 Out 2026 09:30', done: true },
      { title: 'Sessão Agendada', date: '29 Out 2026 09:35', done: true },
      { title: 'Sessão Iniciada', date: 'Hoje às 10:00', done: true },
      { title: 'Avaliação Final', date: 'Pendente', done: false }
    ],
    notes: 'Revisar vocabulário de computação em nuvem.'
  },
  {
    id: 'exc-3',
    partnerId: '3',
    partnerName: 'Carlos Cossa',
    partnerAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
    partnerUniversity: 'ISCTEM',
    partnerCourse: 'Gestão de Empresas',
    skillGiven: 'Introdução a JavaScript',
    skillReceived: 'Excel: Fórmulas Dinâmicas & Dashboards',
    goal: 'Aprender XLOOKUP e construção de relatórios financeiros',
    mode: 'Presencial (Biblioteca Central UEM)',
    scheduledDate: '2026-10-25',
    scheduledTime: '15:00 - 16:30',
    duration: '90 minutos',
    status: 'completed',
    timeline: [
      { title: 'Proposta Enviada', date: '20 Out 2026', done: true },
      { title: 'Pedido Aceite', date: '21 Out 2026', done: true },
      { title: 'Sessão Realizada', date: '25 Out 2026', done: true },
      { title: 'Troca Concluída com Sucesso', date: '25 Out 2026', done: true },
      { title: 'Avaliação 5 Estrelas Registada', date: '25 Out 2026', done: true }
    ],
    notes: 'Sessão muito produtiva, trocamos materiais em PDF.'
  },
  {
    id: 'exc-4',
    partnerId: '5',
    partnerName: 'Hélder Tembe',
    partnerAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces',
    partnerUniversity: 'UEM',
    partnerCourse: 'Física Pura',
    skillGiven: 'Git & GitHub Básico',
    skillReceived: 'Cálculo II: Integrais Triplas',
    goal: 'Resolução orientada da lista de exercícios para teste 2',
    mode: 'Online (Sala de Estudo MEET-US)',
    scheduledDate: '2026-11-12',
    scheduledTime: '18:30 - 20:00',
    duration: '90 minutos',
    status: 'pending',
    timeline: [
      { title: 'Pedido Enviado', date: 'Hoje às 15:30', done: true },
      { title: 'Aguardando Resposta do Parceiro', date: 'Em análise', done: false }
    ],
    notes: 'Aguardando confirmação do horário.'
  }
]

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: {
      id: '2',
      name: 'Amália Mabjaia',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
      institution: 'UEM',
      course: 'Design de Comunicação'
    },
    title: 'Dica rápida para quem está a criar o seu primeiro Design System no Figma',
    content: 'Olá pessoal! Muitos colegas da UEM perguntam por onde começar a organizar cores e tipografia no Figma. A minha principal recomendação é criar tokens semânticos em vez de apenas nomes absolutos. Se alguém quiser fazer uma sessão de 45min a praticar isto em troca de uma introdução a TypeScript, mandem-me mensagem!',
    category: 'Design & Multimédia',
    likesCount: 28,
    isLiked: false,
    saved: false,
    createdAt: 'Há 3 horas',
    tags: ['Figma', 'UIUX', 'DesignSystem', 'TrocaDeSkills'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Edson Mondlane',
        authorAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces',
        text: 'Excelente dica Amália! Estou super interessado em trocar TypeScript por essa mentoria de tokens no Figma.',
        createdAt: 'Há 1 hora'
      },
      {
        id: 'c-2',
        authorName: 'Carlos Cossa',
        authorAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
        text: 'Fantástico! Dá para aplicar essa mesma lógica na padronização de relatórios.',
        createdAt: 'Há 45 minutos'
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      id: '4',
      name: 'Lúcia Nhaca',
      avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
      institution: 'Universidade Pedagógica',
      course: 'Ensino de Inglês'
    },
    title: 'Grupo de Conversação em Inglês: Simulação de Entrevistas de Emprego',
    content: 'Vou abrir 3 slots esta semana para quem tem entrevistas técnicas ou apresentações académicas em inglês. Focamos em entonação, vocabulário do mercado moçambicano e internacional. Quem tiver competências em Marketing ou Python e quiser trocar, vamos conectar!',
    category: 'Línguas & Comunicação',
    likesCount: 35,
    isLiked: true,
    saved: true,
    createdAt: 'Há 6 horas',
    tags: ['Inglês', 'Carreira', 'Speaking', 'Entrevistas'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Hélder Tembe',
        authorAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces',
        text: 'Preciso muito para apresentar o meu artigo de física mês que vem!',
        createdAt: 'Há 2 horas'
      }
    ]
  },
  {
    id: 'post-3',
    author: {
      id: '5',
      name: 'Hélder Tembe',
      avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces',
      institution: 'UEM',
      course: 'Física Pura'
    },
    title: 'Dúvidas em Cálculo II? Não decore fórmulas, entenda a geometria das integrais!',
    content: 'A maior parte dos estudantes reprova em cálculo multivariável porque tenta memorizar passos mecânicos. Se visualizares a projeção da região no plano xy primeiro, os limites de integração tornam-se óbvios. Montei um resumo visual em PDF para quem quiser.',
    category: 'Ciências & Matemática',
    likesCount: 42,
    isLiked: false,
    saved: false,
    createdAt: 'Ontem',
    tags: ['Cálculo', 'Matemática', 'UEM', 'EstudoColaborativo'],
    comments: []
  }
]

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    participantId: '2',
    name: 'Amália Mabjaia',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
    institution: 'UEM',
    course: 'Design de Comunicação',
    online: true,
    lastMessage: 'Perfeito! Já preparei o ficheiro do Figma para a nossa sessão de sexta-feira.',
    lastMessageAt: '14:35',
    unreadCount: 2,
    exchangeRelated: {
      id: 'exc-1',
      title: 'Vue.js ⇄ UI/UX Figma',
      status: 'accepted',
      date: 'Sexta-feira, 16:00'
    },
    messages: [
      { id: 'm-1', sender: 'them', text: 'Olá Edson! Vi que aceitaste o meu pedido de troca!', time: '14:20' },
      { id: 'm-2', sender: 'me', text: 'Olá Amália! Sim, com certeza. Estou ansioso para aprender sobre design systems.', time: '14:25' },
      { id: 'm-3', sender: 'them', text: 'Perfeito! Já preparei o ficheiro do Figma para a nossa sessão de sexta-feira.', time: '14:35' }
    ]
  },
  {
    id: 'conv-2',
    participantId: '4',
    name: 'Lúcia Nhaca',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
    institution: 'Universidade Pedagógica',
    course: 'Ensino de Inglês',
    online: true,
    lastMessage: 'O link da sala de chamada do MEET-US está pronto!',
    lastMessageAt: '10:02',
    unreadCount: 0,
    exchangeRelated: {
      id: 'exc-2',
      title: 'Git ⇄ Inglês Técnico',
      status: 'running',
      date: 'Hoje, 10:00'
    },
    messages: [
      { id: 'm-4', sender: 'them', text: 'Bom dia! Pronta para a nossa prática de hoje.', time: '09:55' },
      { id: 'm-5', sender: 'me', text: 'Bom dia Lúcia! Entrando na sala agora mesmo.', time: '09:58' },
      { id: 'm-6', sender: 'them', text: 'O link da sala de chamada do MEET-US está pronto!', time: '10:02' }
    ]
  },
  {
    id: 'conv-3',
    participantId: '3',
    name: 'Carlos Cossa',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
    institution: 'ISCTEM',
    course: 'Gestão de Empresas',
    online: false,
    lastMessage: 'Muito obrigado pela sessão de sábado, ajudou imenso com as rotas!',
    lastMessageAt: '25 Out',
    unreadCount: 0,
    exchangeRelated: null,
    messages: [
      { id: 'm-7', sender: 'them', text: 'Muito obrigado pela sessão de sábado, ajudou imenso com as rotas!', time: '25 Out 17:15' }
    ]
  }
]

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    category: 'Learning',
    title: 'Esponja de Conhecimento',
    description: 'Conclui 5 sessões como estudante aprendiz',
    icon: 'school',
    current: 4,
    total: 5,
    unlocked: false,
    rewardXP: 250
  },
  {
    id: 'ach-2',
    category: 'Teaching',
    title: 'Mentor Estrela',
    description: 'Recebe 10 avaliações de 5 estrelas dos teus parceiros',
    icon: 'star',
    current: 10,
    total: 10,
    unlocked: true,
    unlockedAt: '28 Out 2026',
    rewardXP: 500
  },
  {
    id: 'ach-3',
    category: 'Collaboration',
    title: 'Ponte Académica',
    description: 'Realiza trocas com estudantes de 3 universidades diferentes',
    icon: 'handshake',
    current: 3,
    total: 3,
    unlocked: true,
    unlockedAt: '15 Out 2026',
    rewardXP: 400
  },
  {
    id: 'ach-4',
    category: 'Community',
    title: 'Voz da Comunidade',
    description: 'Publica 3 posts com mais de 10 curtidas na aba Comunidade',
    icon: 'forum',
    current: 2,
    total: 3,
    unlocked: false,
    rewardXP: 300
  },
  {
    id: 'ach-5',
    category: 'Consistency',
    title: 'Hábito de Ouro',
    description: 'Mantém 4 semanas consecutivas com pelo menos uma troca realizada',
    icon: 'local_fire_department',
    current: 3,
    total: 4,
    unlocked: false,
    rewardXP: 350
  }
]

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    reviewerName: 'Amália Mabjaia',
    reviewerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces',
    reviewerCourse: 'Design de Comunicação',
    rating: 5,
    date: '25 Out 2026',
    exchangeTopic: 'Vue.js Componentes & Reatividade',
    comment: 'O Edson é extremamente didático! Explicou conceitos difíceis de reatividade com exemplos visuais simples. Recomendo a 100%!',
    criteria: { didatica: 5, pontualidade: 5, dominio: 5 }
  },
  {
    id: 'rev-2',
    reviewerName: 'Carlos Cossa',
    reviewerAvatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces',
    reviewerCourse: 'Gestão de Empresas',
    rating: 5,
    date: '18 Out 2026',
    exchangeTopic: 'Git & Estrutura de Pastas',
    comment: 'Excelente sessão prática. Paciente para explicar a lógica de branches e repositórios. Cumprimento pontual do horário.',
    criteria: { didatica: 5, pontualidade: 5, dominio: 4.8 }
  },
  {
    id: 'rev-3',
    reviewerName: 'Lúcia Nhaca',
    reviewerAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces',
    reviewerCourse: 'Ensino de Inglês',
    rating: 4.8,
    date: '10 Out 2026',
    exchangeTopic: 'JavaScript Fundamentos',
    comment: 'Muito atencioso e focado. A troca foi equilibrada e proveitosa para ambos!',
    criteria: { didatica: 4.8, pontualidade: 5, dominio: 4.9 }
  }
]

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Exchanges',
    title: 'Pedido de Troca Aceite!',
    body: 'Amália Mabjaia aceitou o teu pedido de troca de Vue.js por Figma.',
    date: 'Há 1 hora',
    read: false,
    link: '/exchanges/exc-1'
  },
  {
    id: 'notif-2',
    category: 'Connections',
    title: 'Novo Pedido de Conexão',
    body: 'Hélder Tembe quer conectar-se contigo na UEM.',
    date: 'Há 2 horas',
    read: false,
    link: '/connections'
  },
  {
    id: 'notif-3',
    category: 'Achievements',
    title: 'Conquista Desbloqueada: Mentor Estrela',
    body: 'Parabéns! Atingiste 10 avaliações de 5 estrelas e ganhaste +500 XP.',
    date: 'Ontem',
    read: true,
    link: '/achievements'
  },
  {
    id: 'notif-4',
    category: 'Community',
    title: 'Novo Comentário na tua Publicação',
    body: 'Carlos Cossa comentou no teu post de Design Systems.',
    date: 'Ontem',
    read: true,
    link: '/community'
  }
]

export const INITIAL_CALENDAR_EVENTS = [
  {
    id: 'ev-1',
    title: 'Troca: Vue.js ⇄ Figma com Amália',
    date: '2026-11-06',
    time: '16:00 - 17:30',
    type: 'exchange',
    partner: 'Amália Mabjaia',
    mode: 'Online (Sala MEET-US)',
    color: '#5B55D6'
  },
  {
    id: 'ev-2',
    title: 'Sessão em Andamento: Inglês com Lúcia',
    date: '2026-11-08',
    time: '10:00 - 11:00',
    type: 'exchange',
    partner: 'Lúcia Nhaca',
    mode: 'Online (Sala MEET-US)',
    color: '#10B981'
  },
  {
    id: 'ev-3',
    title: 'Plantão de Dúvidas: Git & GitHub',
    date: '2026-11-10',
    time: '14:00 - 16:00',
    type: 'availability',
    partner: 'Comunidade Aberta',
    mode: 'Presencial - Biblioteca Central',
    color: '#8C85F4'
  }
]

export const INITIAL_AVAILABILITY_SLOTS = [
  { id: 'av-1', day: 'Segunda-feira', start: '14:00', end: '18:00', active: true },
  { id: 'av-2', day: 'Quarta-feira', start: '15:00', end: '19:00', active: true },
  { id: 'av-3', day: 'Sexta-feira', start: '14:00', end: '18:00', active: true },
  { id: 'av-4', day: 'Sábado', start: '09:00', end: '13:00', active: true }
]

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    reporterName: 'Carlos Mangue',
    reportedName: 'Utilizador Suspeito',
    reason: 'Spam e cobrança financeira indevida',
    details: 'Tentou cobrar valores monetários por mentoria dentro da plataforma, o que viola as diretrizes de troca gratuita.',
    date: '2026-11-02',
    status: 'open',
    priority: 'Alta'
  },
  {
    id: 'rep-2',
    reporterName: 'Lúcia Nanttumbo',
    reportedName: 'Conta Fictícia',
    reason: 'Identidade não verificada e ausência na chamada',
    details: 'Não compareceu à sessão acordada e o perfil não possui dados universitários válidos.',
    date: '2026-10-29',
    status: 'reviewing',
    priority: 'Média'
  }
]
