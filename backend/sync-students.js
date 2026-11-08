const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BLACK_STUDENTS_AVATARS = [
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces', // Eduardo (Demo)
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', // Amélia Mondlane
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop&crop=faces', // Celso Macuácua
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=faces', // Neusa Tembe
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces', // Lúcia Armando
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&h=400&fit=crop&crop=faces', // Samuel Nantumbo
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces'  // Marta Cossa
];

async function syncMongo() {
  await mongoose.connect('mongodb://127.0.0.1:27017/meetus');
  const db = mongoose.connection.db;

  const demoHash = await bcrypt.hash('demo1234', 10);
  const defaultHash = await bcrypt.hash('password123', 10);

  const students = [
    {
      _id: '1',
      name: 'Eduardo Mondlane',
      email: 'demo@meetus.mz',
      password: demoHash,
      avatar: BLACK_STUDENTS_AVATARS[0],
      bio: 'Estudante de Engenharia Informática na UEM. Apaixonado por desenvolvimento de interfaces e por trocar conhecimentos.',
      institution: 'Universidade Eduardo Mondlane',
      course: 'Engenharia Informática',
      year: 3,
      city: 'Maputo',
      availability: 'Terças e Quintas (15h - 19h), Sábados de manhã',
      reputation: 4.9,
      reviews_count: 24,
      verified: true,
      online: true,
      skills: [
        { name: 'Design de Interfaces', type: 'offer', level: 'Avançado' },
        { name: 'JavaScript & Vue.js', type: 'offer', level: 'Avançado' },
        { name: 'Inglês', type: 'seek', level: 'Intermédio' },
        { name: 'Fotografia', type: 'seek', level: 'Básico' }
      ],
      interests: ['Tecnologia & Inovação', 'Inteligência Artificial', 'Empreendedorismo', 'Música Moçambicana']
    },
    {
      _id: '2',
      name: 'Amélia Mondlane',
      email: 'amelia.mondlane@uem.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[1],
      bio: 'Estudante de Engenharia Informática na UEM. Especialista em Design de Interfaces e React.',
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
      skills: [
        { name: 'Design de Interfaces', type: 'offer', level: 'Especialista' },
        { name: 'React', type: 'offer', level: 'Avançado' },
        { name: 'Inglês', type: 'seek', level: 'Intermédio' },
        { name: 'Fotografia', type: 'seek', level: 'Iniciante' }
      ],
      interests: ['Design UI/UX', 'Educação', 'Fotografia']
    },
    {
      _id: '3',
      name: 'Celso Macuácua',
      email: 'celso.macuacua@uem.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[2],
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
      skills: [
        { name: 'Excel', type: 'offer', level: 'Avançado' },
        { name: 'Contabilidade', type: 'offer', level: 'Intermédio' },
        { name: 'Design de Interfaces', type: 'seek', level: 'Iniciante' },
        { name: 'Inglês', type: 'seek', level: 'Iniciante' }
      ],
      interests: ['Empreendedorismo', 'Finanças', 'Desporto']
    },
    {
      _id: '4',
      name: 'Neusa Tembe',
      email: 'neusa.tembe@unizambeze.ac.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[3],
      bio: 'Estudante de Contabilidade e Auditoria na Beira. Ensino Contabilidade e Excel.',
      institution: 'Universidade Zambeze',
      course: 'Contabilidade e Auditoria',
      year: 4,
      city: 'Beira',
      availability: 'Manhãs de Segunda e Quarta',
      reputation: 4.9,
      reviews_count: 22,
      verified: true,
      online: true,
      compatibilityScore: 91,
      skills: [
        { name: 'Contabilidade', type: 'offer', level: 'Especialista' },
        { name: 'Excel', type: 'offer', level: 'Avançado' },
        { name: 'React', type: 'seek', level: 'Iniciante' },
        { name: 'Fotografia', type: 'seek', level: 'Iniciante' }
      ],
      interests: ['Auditoria', 'Línguas', 'Voluntariado']
    },
    {
      _id: '5',
      name: 'Lúcia Armando',
      email: 'lucia.armando@uem.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[4],
      bio: 'Estudante de Engenharia Civil na UEM.',
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
      skills: [
        { name: 'AutoCAD', type: 'offer', level: 'Avançado' },
        { name: 'Excel', type: 'seek', level: 'Intermédio' }
      ]
    },
    {
      _id: '6',
      name: 'Samuel Nantumbo',
      email: 'samuel.nantumbo@uem.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[5],
      bio: 'Estudante de Economia na UEM.',
      institution: 'Universidade Eduardo Mondlane',
      course: 'Economia',
      year: 3,
      city: 'Maputo',
      availability: 'Quartas e Sextas',
      reputation: 4.7,
      reviews_count: 18,
      verified: true,
      online: true,
      compatibilityScore: 85,
      skills: [
        { name: 'Economia & Finanças', type: 'offer', level: 'Avançado' },
        { name: 'Python para Dados', type: 'seek', level: 'Iniciante' }
      ]
    },
    {
      _id: '7',
      name: 'Marta Cossa',
      email: 'marta.cossa@isctem.ac.mz',
      password: defaultHash,
      avatar: BLACK_STUDENTS_AVATARS[6],
      bio: 'Estudante de Direito no ISCTEM.',
      institution: 'ISCTEM',
      course: 'Direito',
      year: 4,
      city: 'Maputo',
      availability: 'Terças e Quintas',
      reputation: 4.9,
      reviews_count: 25,
      verified: true,
      online: true,
      compatibilityScore: 82,
      skills: [
        { name: 'Direito & Contratos', type: 'offer', level: 'Avançado' },
        { name: 'Oratória', type: 'seek', level: 'Intermédio' }
      ]
    }
  ];

  for (const s of students) {
    await db.collection('users').updateOne(
      { _id: s._id },
      { $set: s },
      { upsert: true }
    );
  }

  console.log('Successfully synced all students to MongoDB matching the UI screenshot exactly!');
  process.exit(0);
}

syncMongo();
