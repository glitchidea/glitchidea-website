// Simple test function
export async function onRequestGet() {
    return new Response(JSON.stringify({
        success: true,
        message: 'Cloudflare Function is working!',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export async function onRequestPost() {
    return new Response(JSON.stringify({
        success: true,
        message: 'POST method is working!',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
