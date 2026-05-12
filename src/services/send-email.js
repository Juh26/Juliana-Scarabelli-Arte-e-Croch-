// src/services/send-email.js
import { Resend } from 'resend';

// Coloque sua API Key do Resend aqui
// Você consegue em: https://resend.com/api-keys
const RESEND_API_KEY = 're_Vja91ppv_4thRgeQujcLMKkFeC528ARit'; // SUBSTITUA PELA SUA API KEY

const resend = new Resend(RESEND_API_KEY);

export async function sendResetPasswordEmail(email, resetLink, nome = 'cliente') {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Domínio de teste do Resend
      to: email,
      subject: '🔐 Recuperação de senha - Juliana Scarabelli Crochê',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px; background: #6b8c5c; color: white; border-radius: 10px 10px 0 0; }
            .header h2 { margin: 0; font-family: 'Playfair Display', Georgia, serif; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .button { 
              background: #6b8c5c; 
              color: white; 
              padding: 14px 28px; 
              text-decoration: none; 
              border-radius: 50px; 
              display: inline-block; 
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover { background: #5a7a4a; }
            .footer { text-align: center; font-size: 12px; color: #8b6f4e; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e8dfd3; }
            .logo { font-size: 40px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🧶</div>
              <h2>Juliana Scarabelli Crochê</h2>
            </div>
            <div class="content">
              <h3>Olá, ${nome}!</h3>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Juliana Scarabelli Crochê</strong>.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" class="button">🔐 Redefinir minha senha</a>
              </p>
              <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
              <p>Este link é válido por <strong>1 hora</strong>.</p>
              <p>Com carinho,<br><strong>Equipe Juliana Scarabelli Crochê</strong></p>
            </div>
            <div class="footer">
              <p>📍 Muriaé, MG - Brasil</p>
              <p>💚 Peças artesanais feitas com amor e dedicação</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Erro Resend:', error);
      return { success: false, error };
    }
    
    console.log('✅ E-mail enviado com sucesso para:', email);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return { success: false, error };
  }
}