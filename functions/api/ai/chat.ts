/**
 * Cloudflare Pages Function: /api/ai/chat
 * Proxies request to Cloudflare AI Gateway
 * Model: @cf/meta/llama-3.1-8b-instruct
 */

interface Env {
  CF_ACCOUNT_ID: string;
  CF_GATEWAY_NAME: string;
  CF_AI_TOKEN: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = (await request.json()) as any;
    const { messages = [], userPreferences = '' } = body;
    const latest = messages[messages.length - 1]?.content || 'Hello';

    const systemPrompt = `You are Healthy Food Hub's certified nutrition and healthy culinary AI assistant.
Provide actionable, friendly, scientifically backed nutrition and cooking advice.
Preferences: ${userPreferences || 'Whole foods, balanced nutrition'}.`;

    if (env.CF_ACCOUNT_ID && env.CF_GATEWAY_NAME && env.CF_AI_TOKEN) {
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.CF_GATEWAY_NAME}/workers-ai/@cf/meta/llama-3.1-8b-instruct`;
      const aiResponse = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CF_AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-6).map((m: any) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (aiResponse.ok) {
        const result: any = await aiResponse.json();
        const reply = result.result?.response || result.response || 'I am here to guide your healthy eating journey.';
        return new Response(JSON.stringify({ reply }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // Context-aware fallback response
    const lower = latest.toLowerCase();
    let reply = `Focus on colorful whole foods, high fiber, and clean proteins. When building any meal, aim for half your plate vegetables, a quarter lean protein, and a quarter slow-burning complex carbohydrates.`;

    if (/breakfast/.test(lower)) {
      reply = `A balanced high-protein breakfast stabilizes blood glucose and prevents morning energy crashes:\n\n• **Option 1:** Avocado Sourdough with 2 poached pasture eggs and microgreens (approx 21g protein).\n• **Option 2:** Whipped Greek Yogurt parfait layered with chia seeds, raw walnuts, and wild blueberries.\n• **Option 3:** Overnight steel-cut oats with plant protein and Ceylon cinnamon.`;
    } else if (/protein|muscle/.test(lower)) {
      reply = `To hit high-protein targets with clean sources:\n\n1. **Wild Alaskan Salmon:** 38g protein with essential omega-3s.\n2. **Free-Range Eggs & Egg Whites:** Gold standard bioavailable protein.\n3. **Organic Tempeh & Extra Firm Tofu:** 18-22g protein per 100g.\n4. **0% Greek Yogurt:** 18g protein per cup.\n5. **Lentils & Edamame:** High fiber + complete plant amino acids.`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'ai_error', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
