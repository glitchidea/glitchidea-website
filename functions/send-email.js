// Cloudflare Pages Function for email sending
export async function onRequestPost(context) {
    const { request, env } = context;
    
    console.log('🚀 Cloudflare Function started');
    console.log('📧 Request method:', request.method);
    console.log('📧 Request URL:', request.url);
    
    try {
        // Parse request body
        const { subject, message, senderEmail } = await request.json();
        
        console.log('📧 Cloudflare Function called');
        console.log('📧 Request data:', { subject, senderEmail, messageLength: message?.length });
        console.log('📧 Environment variables check:', {
            hasUsername: !!env.SMTP_USERNAME,
            hasPassword: !!env.SMTP_PASSWORD,
            hasToEmail: !!env.TO_EMAIL
        });
        
        // Validate required fields
        if (!subject || !message || !senderEmail) {
            console.log('❌ Missing required fields');
            return new Response(JSON.stringify({
                success: false,
                message: 'Tüm alanlar doldurulmalıdır'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            console.log('❌ Invalid email format:', senderEmail);
            return new Response(JSON.stringify({
                success: false,
                message: 'Geçerli bir email adresi giriniz'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }
        
        // Check environment variables
        if (!env.SMTP_USERNAME || !env.SMTP_PASSWORD) {
            console.log('❌ Missing SMTP credentials');
            return new Response(JSON.stringify({
                success: false,
                message: 'Email servisi yapılandırılmamış'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }
        
        // Create email content
        const currentDate = new Date().toLocaleString('tr-TR');
        const formattedSubject = `${subject} - gönderen(${senderEmail})`;
        
        const htmlContent = createEmailHTML(subject, message, senderEmail, currentDate);
        const textContent = createEmailText(subject, message, senderEmail, currentDate);
        
        // Send email using Cloudflare's email service or external service
        const emailData = {
            from: {
                email: env.FROM_EMAIL || env.SMTP_USERNAME,
                name: env.FROM_NAME || 'GlitchIdea'
            },
            to: [{ email: env.TO_EMAIL || env.SMTP_USERNAME }],
            subject: formattedSubject,
            html: htmlContent,
            text: textContent
        };
        
        // Use Cloudflare's email API or external service
        const emailResponse = await sendEmailViaAPI(emailData, env);
        
        if (emailResponse.success) {
            console.log('✅ Email sent successfully');
            return new Response(JSON.stringify({
                success: true,
                message: 'Mesajınız başarıyla gönderildi!',
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        } else {
            throw new Error(emailResponse.message || 'Email sending failed');
        }
        
    } catch (error) {
        console.error('❌ Function error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: `Email gönderme hatası: ${error.message}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}

// Send email via external API (like EmailJS, SendGrid, or similar)
async function sendEmailViaAPI(emailData, env) {
    try {
        // For now, we'll use a simple webhook approach
        // You can replace this with SendGrid, Resend, or other email service
        
        // Example with a webhook service
        const webhookUrl = env.EMAIL_WEBHOOK_URL;
        
        if (webhookUrl) {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.EMAIL_API_KEY || ''}`
                },
                body: JSON.stringify(emailData)
            });
            
            if (response.ok) {
                return { success: true };
            } else {
                const error = await response.text();
                return { success: false, message: error };
            }
        }
        
        // Fallback: Just log the email (for development)
        console.log('📧 Email would be sent:', emailData);
        return { success: true, message: 'Email logged (development mode)' };
        
    } catch (error) {
        console.error('Email API error:', error);
        return { success: false, message: error.message };
    }
}

// Create HTML email content
function createEmailHTML(subject, message, senderEmail, currentDate) {
    return `
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
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .message-card {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                border: 1px solid #e9ecef;
            }
            .message-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .sender-info h3 {
                margin: 0 0 5px 0;
                color: #495057;
                font-size: 18px;
            }
            .sender-email {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .message-date {
                color: #6c757d;
                font-size: 14px;
                margin-top: 5px;
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
                white-space: pre-wrap;
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
                            <h3>${senderEmail.split('@')[0]}</h3>
                            <a href="mailto:${senderEmail}?subject=Re: ${subject}" class="sender-email">${senderEmail}</a>
                        </div>
                        <div class="message-date">${currentDate}</div>
                    </div>
                    
                    <div class="message-subject">${subject}</div>
                    
                    <div class="message-body">${message}</div>
                </div>
            </div>
            
            <div class="footer">
                <a href="mailto:${senderEmail}?subject=Re: ${subject}" class="reply-button">
                    📧 Hızlı Yanıt Gönder
                </a>
                <p class="footer-text">
                    Bu mesaj glitchidea.com adresinden gönderilmiştir.<br>
                    Gönderim Tarihi: ${currentDate}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Create text email content
function createEmailText(subject, message, senderEmail, currentDate) {
    return `
Konu: ${subject}
Gönderen: ${senderEmail}

Mesaj:
${message}

---
Bu mesaj glitchidea.com adresinden gönderilmiştir.
Gönderim Tarihi: ${currentDate}

💡 Hızlı Yanıt: ${senderEmail} adresine "Re: ${subject}" konusuyla yanıt verebilirsiniz.
    `;
}
