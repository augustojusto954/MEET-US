// backend/tunnel.js
const ngrok = require('@ngrok/ngrok');

const PORT = process.env.PORT || 3000;
const AUTHTOKEN = process.env.NGROK_AUTHTOKEN || '3GPKgLBTalWRpBufKIIczkmn8Pa_JVoCNS9rxXjeJqYoWBAL';
const DOMAIN = process.env.NGROK_DOMAIN || 'wrench-astrology-satchel.ngrok-free.dev';

async function startTunnel() {
  try {
    console.log(`[ngrok] A ligar túnel seguro para http://localhost:${PORT}...`);
    console.log(`[ngrok] Domínio configurado: https://${DOMAIN}`);

    const listener = await ngrok.forward({
      addr: PORT,
      authtoken: AUTHTOKEN,
      domain: DOMAIN
    });

    console.log('====================================================');
    console.log('🎉 TÚNEL NGROK ATIVO E PÚBLICO COM SUCESSO!');
    console.log(`🌐 Link Público: ${listener.url()}`);
    console.log(`📡 Encaminhando para: http://localhost:${PORT}`);
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Erro ao iniciar o ngrok:', err.message || err);
    // Tentar sem forçar o domínio se o domínio específico falhar
    if (DOMAIN) {
      console.log('[ngrok] A tentar túnel público dinâmico padrão...');
      try {
        const fallbackListener = await ngrok.forward({
          addr: PORT,
          authtoken: AUTHTOKEN
        });
        console.log('====================================================');
        console.log('🎉 TÚNEL NGROK DINÂMICO ATIVO!');
        console.log(`🌐 Link Público: ${fallbackListener.url()}`);
        console.log('====================================================');
      } catch (fallbackErr) {
        console.error('❌ Erro no fallback do ngrok:', fallbackErr.message || fallbackErr);
      }
    }
  }
}

startTunnel();
