/**
 * Cloudflare Pages Function: /api/ai/meal-plan
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
    const { duration = 7, dietary = 'Balanced', budget = 'medium', preferences = [] } = body;
    const daysCount = Number(duration) === 1 ? 1 : Number(duration) === 30 ? 30 : 7;
    const sampleDays = Math.min(daysCount, 7);

    const prompt = `You are a certified sports nutritionist.
Create a structured ${daysCount}-day healthy meal plan JSON:
Dietary preference: ${dietary}
Budget: ${budget}
Preferences: ${preferences.join(', ')}

Return strictly JSON without markdown:
{
  "title": "${daysCount}-Day ${dietary} Meal Plan",
  "budgetLevel": "${budget}",
  "days": [
    {
      "day": number,
      "dayName": "string",
      "totalCalories": number,
      "breakfast": {"name": "string", "description": "string", "calories": number, "prepTime": number},
      "lunch": {"name": "string", "description": "string", "calories": number, "prepTime": number},
      "dinner": {"name": "string", "description": "string", "calories": number, "prepTime": number},
      "snacks": [{"name": "string", "description": "string", "calories": number}]
    }
  ]
}`;

    if (env.CF_ACCOUNT_ID && env.CF_GATEWAY_NAME && env.CF_AI_TOKEN) {
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.CF_GATEWAY_NAME}/workers-ai/@cf/meta/llama-3.1-8b-instruct`;
      const aiResponse = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CF_AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (aiResponse.ok) {
        const result: any = await aiResponse.json();
        const rawText = result.result?.response || result.response || '';
        const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return new Response(cleanJson, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // High quality deterministic fallback
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days = [];
    for (let i = 1; i <= sampleDays; i++) {
      days.push({
        day: i,
        dayName: daysCount === 1 ? 'Today' : `Day ${i} (${dayLabels[(i - 1) % 7]})`,
        totalCalories: 1850 + (i % 3) * 60,
        breakfast: {
          name: i % 2 === 0 ? 'Chia Greek Yogurt Parfait' : 'Avocado Sourdough with Poached Egg',
          description: 'High protein breakfast balanced with complex carbs and antioxidants.',
          calories: 410,
          prepTime: 8,
        },
        lunch: {
          name: i % 2 === 0 ? 'Mediterranean Quinoa Green Bowl' : 'Grilled Chicken Breast Citrus Salad',
          description: 'Power greens paired with clean protein and light dressing.',
          calories: 520,
          prepTime: 15,
        },
        dinner: {
          name: i % 2 === 0 ? 'Baked Wild Salmon with Asparagus' : 'Thai Coconut Veggie Tofu Curry',
          description: 'Nutritious dinner rich in essential micronutrients and omega-3s.',
          calories: 580,
          prepTime: 20,
        },
        snacks: [
          { name: 'Raw Walnuts & Apple Slices', description: 'Brain-boosting polyphenols', calories: 180 },
          { name: 'Matcha Green Tea', description: 'Antioxidant calm energy', calories: 80 },
        ],
      });
    }

    return new Response(
      JSON.stringify({
        id: 'plan-' + Date.now(),
        title: `${daysCount}-Day ${dietary} Vitality Plan`,
        durationDays: daysCount,
        budgetLevel: budget,
        dietaryPreferences: [dietary],
        days,
        createdAt: new Date().toISOString().split('T')[0],
      }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'ai_error', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
