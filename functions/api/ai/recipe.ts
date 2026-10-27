/**
 * Cloudflare Pages Function: /api/ai/recipe
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
    const userId = request.headers.get('x-user-id') || 'guest';
    const body = (await request.json()) as any;
    const { ingredients = [], dietary = 'Any', cookTime = 'Any', difficulty = 'Any' } = body;

    const prompt = `You are a professional Michelin-trained healthy culinary nutrition chef.
Generate a delicious, highly realistic, balanced healthy recipe using these inputs:
Ingredients available: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}
Dietary preference: ${dietary}
Max Cook Time: ${cookTime}
Difficulty: ${difficulty}

You must return valid JSON only without markdown code blocks:
{
  "title": "string",
  "description": "string",
  "prepTime": number,
  "cookTime": number,
  "servings": number,
  "difficulty": "easy" | "medium" | "hard",
  "dietaryLabels": ["string"],
  "ingredients": [{"amount": number, "unit": "string", "name": "string"}],
  "instructions": [{"step": number, "text": "string"}],
  "nutrition": {"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number}
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
    const primary = (ingredients[0] || 'Herb Salmon').replace(/\b\w/g, (c: string) => c.toUpperCase());
    return new Response(
      JSON.stringify({
        id: 'rec-' + Date.now(),
        title: `Chef's Nourish ${primary} Plate`,
        description: `Nutrient-dense recipe emphasizing fresh ${ingredients.slice(0, 3).join(', ') || 'whole ingredients'} and healthy fats.`,
        prepTime: 12,
        cookTime: 18,
        servings: 2,
        difficulty: difficulty === 'medium' ? 'medium' : 'easy',
        dietaryLabels: [dietary !== 'Any' ? dietary : 'High-Protein', 'Gluten-Free'],
        ingredients: [
          { amount: 2, unit: 'portions', name: primary },
          { amount: 2, unit: 'cups', name: ingredients[1] || 'Baby Greens' },
          { amount: 1, unit: 'cup', name: ingredients[2] || 'Quinoa' },
          { amount: 2, unit: 'tbsp', name: 'Cold-Pressed Olive Oil' },
        ],
        instructions: [
          { step: 1, text: `Gently season the ${primary} with sea salt and cracked pepper.` },
          { step: 2, text: 'Roast or sear for 12-15 minutes until tender.' },
          { step: 3, text: 'Toss greens and warm grains with olive oil and serve.' },
        ],
        nutrition: { calories: 420, protein: 36, carbs: 24, fat: 20, fiber: 6 },
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
