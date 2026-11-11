// backend/clean-users.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const mongoose = require('mongoose');

async function cleanUsers() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log('Conectando ao MongoDB:', uri.replace(/:[^:@]+@/, ':****@'));
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  console.log('Conectado com sucesso ao Atlas!');

  const db = mongoose.connection.db;

  // 1. Manter apenas Maria e Admin
  const keepEmails = ['admin@meetus.mz', 'maria@gmail.com'];
  const deleteResult = await db.collection('users').deleteMany({ email: { $nin: keepEmails } });
  console.log('Utilizadores eliminados do Atlas:', deleteResult.deletedCount);

  const remainingUsers = await db.collection('users').find({}).toArray();
  console.log('Utilizadores restantes:', remainingUsers.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

  const adminUser = remainingUsers.find(u => u.email === 'admin@meetus.mz');
  const mariaUser = remainingUsers.find(u => u.email === 'maria@gmail.com');

  // 2. Limpar sessões antigas e criar 2 sessões oficiais para Maria e Admin
  await db.collection('sessions').deleteMany({});
  await db.collection('sessions').insertMany([
    {
      _id: 'session-1',
      title: 'Mentoria e Programação Web com Vue 3',
      subject: 'Engenharia de Software e Tecnologias Web',
      description: 'Sessão interativa de mentoria técnica, arquitetura de sistemas e boas práticas de desenvolvimento.',
      host_id: String(adminUser ? adminUser._id : 'admin-001'),
      host_name: adminUser?.name || 'Administrador MEET-US',
      host_avatar: 'https://ui-avatars.com/api/?name=Admin&background=0B825B&color=ffffff&size=256&bold=true',
      host_course: 'Coordenação Geral MEET-US (Maputo)',
      status: 'SCHEDULED',
      scheduled_at: new Date().toISOString(),
      started_at: null,
      ended_at: null,
      max_participants: 50,
      participants: mariaUser ? [
        {
          user_id: String(mariaUser._id),
          user_name: mariaUser.name,
          user_avatar: mariaUser.avatar || '',
          user_course: mariaUser.course || 'Estudante UEM',
          status: 'JOINED',
          joined_at: new Date().toISOString()
        }
      ] : [],
      chat_messages: [
        {
          sender_id: String(adminUser ? adminUser._id : 'admin-001'),
          sender_name: adminUser?.name || 'Administrador',
          sender_avatar: 'https://ui-avatars.com/api/?name=Admin&background=0B825B&color=ffffff&size=256&bold=true',
          text: 'Olá Maria! Bem-vinda à sala em directo do MEET-US.',
          time: '12:00'
        }
      ],
      settings: { allow_mic: true, allow_camera: true, allow_chat: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'session-2',
      title: 'Sessão de Estudos e Dúvidas com Maria',
      subject: 'Aprendizagem Colaborativa e Troca de Competências',
      description: 'Espaço aberto para resolução de exercícios, troca de ideias e estudo colaborativo entre colegas.',
      host_id: String(mariaUser ? mariaUser._id : '6af4f12c4246720ad41a6103'),
      host_name: mariaUser?.name || 'Maria',
      host_avatar: mariaUser?.avatar || 'https://ui-avatars.com/api/?name=Maria&background=DC2626&color=ffffff&size=256&bold=true',
      host_course: 'Universidade Eduardo Mondlane (UEM)',
      status: 'SCHEDULED',
      scheduled_at: new Date(Date.now() + 3600000).toISOString(),
      started_at: null,
      ended_at: null,
      max_participants: 30,
      participants: [],
      chat_messages: [],
      settings: { allow_mic: true, allow_camera: true, allow_chat: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  console.log('Sessões atualizadas no Atlas com sucesso.');

  // 3. Limpar posts antigos
  const keepUserIds = remainingUsers.map(u => String(u._id));
  await db.collection('posts').deleteMany({ author_id: { $nin: keepUserIds } });
  
  // Criar post de boas-vindas do admin
  if (adminUser) {
    await db.collection('posts').deleteMany({});
    await db.collection('posts').insertOne({
      _id: 'post-welcome',
      author_id: String(adminUser._id),
      author_name: adminUser.name,
      author_avatar: 'https://ui-avatars.com/api/?name=Admin&background=0B825B&color=ffffff&size=256&bold=true',
      author_course: 'Coordenação Geral',
      author_institution: 'MEET-US Moçambique',
      title: 'Bem-vindos ao MEET-US: Plataforma de Mentoria Universitária 🇲🇿',
      content: 'Bem-vinda Maria e toda a comunidade universitária! A plataforma está pronta para troca de competências, salas de estudo em tempo real e mentoria.',
      category: 'Geral',
      tags: ['MEET-US', 'UEM', 'Mentoria', 'Moçambique'],
      likes: [String(adminUser._id)],
      likes_count: 1,
      comments: [],
      createdAt: new Date().toISOString()
    });
  }

  // 4. Limpar conversas e mensagens antigas
  await db.collection('exchanges').deleteMany({});
  await db.collection('matches').deleteMany({});
  await db.collection('notifications').deleteMany({});

  // 5. Atualizar .data/ local
  const dataDir = path.join(__dirname, '.data');
  if (fs.existsSync(dataDir)) {
    fs.writeFileSync(path.join(dataDir, 'User.json'), JSON.stringify(remainingUsers, null, 2), 'utf8');
    console.log('Atualizado backend/.data/User.json com sucesso.');
  }

  console.log('Concluído com sucesso!');
  process.exit(0);
}

cleanUsers().catch(err => {
  console.error('Erro na limpeza:', err);
  process.exit(1);
});
