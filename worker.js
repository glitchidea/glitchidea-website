// Cloudflare Worker - Gmail ile mail gönderme
export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://glitchidea.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      const { subject, message, senderEmail } = data;

      // Validation
      if (!subject || !message || !senderEmail) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Tüm alanlar doldurulmalıdır'
        }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(senderEmail)) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Geçerli bir email adresi giriniz'
        }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // KV'ye kaydet
      await saveToKV(env, { subject, message, senderEmail });

      // Gmail ile mail gönder
      await sendGmail(env, { subject, message, senderEmail });

      return new Response(JSON.stringify({
        success: true,
        message: 'Mesajınız başarıyla gönderildi!',
        timestamp: new Date().toISOString()
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        success: false,
        message: 'Internal server error'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// KV'ye kaydet
async function saveToKV(env, { subject, message, senderEmail }) {
  const messageData = {
    subject,
    message,
    senderEmail,
    timestamp: new Date().toISOString(),
    id: `msg_${Date.now()}`
  };

  await env.MESSAGES.put(`msg_${Date.now()}`, JSON.stringify(messageData));
}

// Gmail ile mail gönder
async function sendGmail(env, { subject, message, senderEmail }) {
  // Gmail bilgileri
  const gmailUser = env.SMTP_USERNAME; // glitchidea65@gmail.com
  const gmailAppPassword = env.SMTP_PASSWORD; // App password
  const targetMail = env.TO_EMAIL; // info@glitchidea.com
  
  // Konuyu formatla
  const formattedSubject = `${subject} - gönderen(${senderEmail})`;
  
  // Mail içeriği
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f5f7fa;
            }
            .email-container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 12px; 
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 300; 
            }
            .content { 
                padding: 30px; 
            }
            .message-card { 
                background: #f8f9fa; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 20px 0; 
                border-left: 5px solid #667eea;
            }
            .message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }
            .sender-info {
                flex: 1;
            }
            .sender-name {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
            .sender-email {
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
                margin: 5px 0 0 0;
            }
            .message-date {
                color: #6c757d;
                font-size: 14px;
                text-align: right;
            }
            .message-subject {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin: 15px 0;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .message-body { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                font-size: 16px;
                line-height: 1.7;
                color: #444;
            }
            .footer { 
                background: #f8f9fa; 
                padding: 25px; 
                text-align: center; 
                border-top: 1px solid #e9ecef;
            }
            .reply-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                display: inline-block;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                margin: 10px 0;
            }
            .footer-text {
                color: #6c757d;
                font-size: 14px;
                margin: 15px 0 0 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>📧 Yeni Mesaj Aldınız</h1>
            </div>
            
            <div class="content">
                <div class="message-card">
                    <div class="message-header">
                        <div class="sender-info">
                            <h3 class="sender-name">${senderEmail.split('@')[0]}</h3>
                            <a href="mailto:${senderEmail}?subject=Re: ${subject}" class="sender-email">${senderEmail}</a>
                        </div>
                        <div class="message-date">${new Date().toLocaleString('tr-TR')}</div>
                    </div>
                    
                    <div class="message-subject">${subject}</div>
                    
                    <div class="message-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <a href="mailto:${senderEmail}?subject=Re: ${subject}" class="reply-button">
                    📧 Hızlı Yanıt Gönder
                </a>
                <p class="footer-text">
                    Bu mesaj glitchidea65@gmail.com adresinden gönderilmiştir.<br>
                    Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
Konu: ${subject}
Gönderen: ${senderEmail}

Mesaj:
${message}

---
Bu mesaj glitchidea65@gmail.com adresinden gönderilmiştir.
Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}

💡 Hızlı Yanıt: ${senderEmail} adresine "Re: ${subject}" konusuyla yanıt verebilirsiniz.
  `;

  // SMTP ile mail gönder
  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Smtp2go-Api-Key': env.SMTP2GO_API_KEY
    },
    body: JSON.stringify({
      api_key: env.SMTP2GO_API_KEY,
      to: [targetMail],
      sender: gmailUser,
      subject: formattedSubject,
      text_body: textContent,
      html_body: htmlContent
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}
