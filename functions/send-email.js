// Cloudflare Pages Function for email sending

// Debug function to log everything
function debugLog(step, data) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔍 DEBUG STEP ${step}:`, JSON.stringify(data, null, 2));
}

// Handle ALL HTTP methods for debugging
export async function onRequest(context) {
    debugLog('START', {
        step: 'Function entry point',
        method: context.request.method,
        url: context.request.url,
        hasEnv: !!context.env
    });
    
    // Handle OPTIONS for CORS
    if (context.request.method === 'OPTIONS') {
        debugLog('OPTIONS', { message: 'Handling CORS preflight' });
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            }
        });
    }
    
    // Handle GET for testing
    if (context.request.method === 'GET') {
        debugLog('GET', { message: 'Function is alive' });
        
        // Test environment variables without showing values
        const envTest = {
            SMTP_HOST: context.env.SMTP_HOST ? 'EXISTS' : 'MISSING',
            SMTP_PORT: context.env.SMTP_PORT ? 'EXISTS' : 'MISSING',
            SMTP_USERNAME: context.env.SMTP_USERNAME ? 'EXISTS' : 'MISSING',
            SMTP_PASSWORD: context.env.SMTP_PASSWORD ? 'EXISTS' : 'MISSING',
            TO_EMAIL: context.env.TO_EMAIL ? 'EXISTS' : 'MISSING',
            FROM_EMAIL: context.env.FROM_EMAIL ? 'EXISTS' : 'MISSING',
            FROM_NAME: context.env.FROM_NAME ? 'EXISTS' : 'MISSING'
        };
        
        debugLog('ENV_TEST', {
            step: 'Environment variables test',
            variables: envTest,
            totalFound: Object.values(envTest).filter(v => v === 'EXISTS').length,
            totalExpected: 7
        });
        
        return new Response(JSON.stringify({
            success: true,
            message: '✅ Cloudflare Function is working!',
            timestamp: new Date().toISOString(),
            method: 'GET',
            environmentTest: envTest,
            status: Object.values(envTest).filter(v => v === 'EXISTS').length === 7 ? 'ALL_VARS_FOUND' : 'MISSING_VARS'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    // Handle POST for email sending
    if (context.request.method === 'POST') {
        return await handleEmailPost(context);
    }
    
    // Method not allowed
    debugLog('ERROR', { message: 'Method not allowed', method: context.request.method });
    return new Response(JSON.stringify({
        success: false,
        message: `Method ${context.request.method} not allowed`
    }), {
        status: 405,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// Separate function for handling POST requests
async function handleEmailPost(context) {
    const { request, env } = context;
    
    debugLog('POST_START', {
        step: 'POST handler started',
        contentType: request.headers.get('content-type'),
        hasBody: !!request.body
    });
    
    try {
        // Parse request body
        debugLog('PARSE_BODY', { step: 'Parsing request body' });
        const { subject, message, senderEmail } = await request.json();
        
        debugLog('BODY_PARSED', {
            step: 'Request body parsed successfully',
            subject: subject,
            senderEmail: senderEmail,
            messageLength: message?.length
        });
        
        // Detailed environment variables check
        const envStatus = {
            SMTP_HOST: env.SMTP_HOST ? 'EXISTS' : 'MISSING',
            SMTP_PORT: env.SMTP_PORT ? 'EXISTS' : 'MISSING', 
            SMTP_USERNAME: env.SMTP_USERNAME ? 'EXISTS' : 'MISSING',
            SMTP_PASSWORD: env.SMTP_PASSWORD ? 'EXISTS' : 'MISSING',
            TO_EMAIL: env.TO_EMAIL ? 'EXISTS' : 'MISSING',
            FROM_EMAIL: env.FROM_EMAIL ? 'EXISTS' : 'MISSING',
            FROM_NAME: env.FROM_NAME ? 'EXISTS' : 'MISSING'
        };
        
        const missingVars = Object.entries(envStatus).filter(([key, status]) => status === 'MISSING');
        
        debugLog('ENV_CHECK', {
            step: 'Environment variables detailed check',
            envStatus: envStatus,
            foundCount: Object.values(envStatus).filter(v => v === 'EXISTS').length,
            expectedCount: 7,
            missingVars: missingVars.map(([key]) => key),
            allFound: missingVars.length === 0
        });
        
        // Check if environment variables are configured
        if (!env.SMTP_USERNAME || !env.SMTP_PASSWORD) {
            debugLog('ENV_MISSING', {
                step: 'Critical environment variables missing',
                hasUsername: !!env.SMTP_USERNAME,
                hasPassword: !!env.SMTP_PASSWORD,
                message: 'Email servisi yapılandırılmamış'
            });
            
            return new Response(JSON.stringify({
                success: false,
                message: 'Email servisi yapılandırılmamış',
                debug: {
                    missingVariables: missingVars.map(([key]) => key),
                    foundVariables: Object.entries(envStatus).filter(([key, status]) => status === 'EXISTS').map(([key]) => key)
                }
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
        
        // Validate required fields
        debugLog('VALIDATION', {
            step: 'Validating required fields',
            hasSubject: !!subject,
            hasMessage: !!message,
            hasSenderEmail: !!senderEmail
        });
        
        if (!subject || !message || !senderEmail) {
            debugLog('VALIDATION_FAILED', {
                step: 'Validation failed - missing fields',
                subject: subject,
                message: message ? 'present' : 'missing',
                senderEmail: senderEmail
            });
            
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
        debugLog('ERROR', {
            step: 'Function error caught',
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack
        });
        
        return new Response(JSON.stringify({
            success: false,
            message: `Email gönderme hatası: ${error.message}`,
            debug: {
                error: error.name,
                stack: error.stack?.split('\n')[0] // First line of stack trace
            }
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
