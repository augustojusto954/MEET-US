# MEET-US

> Plataforma Universitária de Aprendizagem Colaborativa, Mentoria e Troca de Competências em Moçambique.

---

## 📌 Visão Geral

O **MEET-US** é um ecossistema académico moderno, inclusivo e resiliente desenhado especificamente para a realidade do ensino superior moçambicano. A plataforma liga estudantes e mentores entre universidades e províncias com recurso a:
- **Matchmaking Inteligente** baseado em competências e interesses académicos.
- **Salas de Estudo em Tempo Real (WebRTC & Socket.IO)** para vídeo, áudio e colaboração com baixo consumo de dados.
- **Arquitetura Offline-First (PWA & SQLite/IndexedDB)** permitindo consulta e navegação fluida mesmo sem internet ou em redes intermitentes.
- **Gamificação Educativa** com pontos de colaboração, níveis e insígnias de mentoria.
- **Painel Administrativo Completo** com monitorização de sessões, métricas e gestão de utilizadores.

---

## 🚀 Como Executar o Projeto

### Início Rápido no Windows
Basta dar duplo clique no ficheiro:
```bat
iniciar-servidor-e-tunel.bat
```
Isto iniciará automaticamente o servidor backend Node.js (Porta 3000) e o túnel público Cloudflare.

### Execução Manual por Comandos
```bash
# 1. Iniciar o Backend
npm start
# ou: node backend/src/server.js

# 2. Expor publicamente para telemóveis e outros computadores
./cloudflared.exe tunnel --url http://localhost:3000
```

---

## 🔑 Credenciais para Demonstração e Testes

| Utilizador | E-mail / Identificador | Palavra-passe | Perfil / Faculdade |
| :--- | :--- | :--- | :--- |
| **Rosa Nhaca** | `rosa@meetus.mz` *(ou `rosa`)* | `123456` *(ou `rosa`)* | Estudante & Mentora — UEM (Maputo) |
| **Administrador** | `admin@meetus.mz` *(ou `admin`)* | `admin1234` | Gestor da Plataforma & Métricas Globais |
| **Edson Arnaldo** | `edson@meetus.mz` *(ou `edson`)* | `123456` *(ou `demo1234`)* | Ciências da Computação — UP (Beira) |
| **Samira Patel** | `samira@meetus.mz` | `123456` | Medicina e Saúde Comunitária — UniZambeze |
| **Carlos Macuácua** | `carlos@meetus.mz` | `123456` | Gestão e Contabilidade — USTM (Nampula) |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Vue.js 3, Quasar Framework v2, Pinia, Vue Router, PWA Workbox, WebRTC.
- **Backend:** Node.js, Express, Socket.IO, JWT, Mongoose, SQLite (offline fallback).
- **Base de Dados:** MongoDB (Principal) + SQLite (Replicação Local Resiliente).
- **Distribuição:** Progressive Web App (PWA), Electron Desktop (.exe / .zip).
- **Documentação:** Manual Oficial em PDF (`MEET-US-Manual-e-Roteiro-Oficial.pdf`).

---

## 📄 Documentação e Recursos
- **Manual e Roteiro Oficial (PDF):** `MEET-US-Manual-e-Roteiro-Oficial.pdf`
- **Instalador Desktop Windows:** `backend/uploads/MEET-US-Windows-x64.zip`
