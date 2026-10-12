export interface AnalyzedMealItem {
  name: string;
  portion: string;
  kcal: number;
}

export interface AnalyzedMealData {
  isFood: boolean;
  notFoodReason?: string;
  title: string;
  totalKcal: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  items: AnalyzedMealItem[];
}

/**
 * Analyzes meal using Google Gemini Vision (100% Free).
 */
async function analyzeWithGemini(imageUri: string, apiKey: string): Promise<AnalyzedMealData> {
  const prompt = `You are a professional nutritionist and AI vision food detector.
Look at this image carefully.

Step 1: Check if the image contains any real, edible food or drink.
- If there is NO edible food or drink in the photo (for example, if it's a person, animal, laptop, furniture, room, car, document, empty plate, or other non-food item):
Respond STRICTLY with this JSON:
{
  "isFood": false,
  "notFoodReason": "No food or drink detected in this photo. Please snap a picture of your meal."
}

Step 2: If food or drink IS present:
Identify each food item, portion size, calories, and total macronutrients.
Respond STRICTLY with this JSON:
{
  "isFood": true,
  "title": "Short descriptive name of the meal (e.g. Grilled Chicken, Rice & Salad)",
  "totalKcal": 650,
  "carbsGrams": 65,
  "proteinGrams": 40,
  "fatGrams": 18,
  "items": [
    {
      "name": "Grilled chicken breast",
      "portion": "about 150 g",
      "kcal": 250
    },
    {
      "name": "White rice",
      "portion": "about 1 cup",
      "kcal": 220
    },
    {
      "name": "Mixed green salad",
      "portion": "about 1 bowl",
      "kcal": 180
    }
  ]
}`;

  // Extract pure base64 data
  const base64Data = imageUri.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

  // Try gemini-2.0-flash first, then gemini-1.5-flash as fallback
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini (${model}) error ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsed = JSON.parse(rawText);

      if (parsed.isFood === false) {
        return {
          isFood: false,
          notFoodReason: parsed.notFoodReason || 'No food or drink detected in this photo.',
          title: 'No Food Detected',
          totalKcal: 0,
          carbsGrams: 0,
          proteinGrams: 0,
          fatGrams: 0,
          items: [],
        };
      }

      const totalKcal = Number(parsed.totalKcal) || 500;
      const carbsGrams = Number(parsed.carbsGrams) || Math.round((totalKcal * 0.4) / 4);
      const proteinGrams = Number(parsed.proteinGrams) || Math.round((totalKcal * 0.3) / 4);
      const fatGrams = Number(parsed.fatGrams) || Math.round((totalKcal * 0.3) / 9);

      const items = Array.isArray(parsed.items) && parsed.items.length > 0
        ? parsed.items.map((item: any) => ({
            name: String(item.name || 'Food item'),
            portion: String(item.portion || '1 serving'),
            kcal: Number(item.kcal) || Math.round(totalKcal / parsed.items.length),
          }))
        : [{ name: parsed.title || 'Meal', portion: '1 plate', kcal: totalKcal }];

      return {
        isFood: true,
        title: parsed.title || 'Analyzed Meal',
        totalKcal,
        carbsGrams,
        proteinGrams,
        fatGrams,
        items,
      };
    } catch (err) {
      lastError = err;
      console.warn(`Attempt with ${model} failed, trying fallback if available:`, err);
    }
  }

  throw lastError || new Error('Gemini vision analysis failed');
}

/**
 * Analyzes a meal image using Gemini Vision (if configured) or DeepSeek via Hugging Face.
 * @param imageUri Base64 data URI or image URL
 */
export async function analyzeMealImage(imageUri: string): Promise<AnalyzedMealData> {
  const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();

  // If Gemini API key is provided, use Gemini Vision (100% free)
  if (geminiApiKey) {
    return analyzeWithGemini(imageUri, geminiApiKey);
  }

  const baseUrl = process.env.EXPO_PUBLIC_HF_BASE_URL || 'https://router.huggingface.co/v1';
  const model = process.env.EXPO_PUBLIC_HF_MODEL || 'deepseek-ai/DeepSeek-V4.1-Flash:novita';
  const hfToken = process.env.EXPO_PUBLIC_HF_TOKEN?.trim();

  if (!hfToken) {
    throw new Error('HF_TOKEN_MISSING');
  }

  // Ensure image is formatted as a valid data URI
  const formattedImageUrl = imageUri.startsWith('data:')
    ? imageUri
    : imageUri.startsWith('http')
    ? imageUri
    : `data:image/jpeg;base64,${imageUri}`;

  const prompt = `You are a professional nutritionist and AI vision food detector.
Look at this image carefully.

Step 1: Check if the image contains any real, edible food or drink.
- If there is NO edible food or drink in the photo (for example, if it's a person, animal, laptop, furniture, room, car, document, empty plate, or other non-food item):
Respond STRICTLY with this JSON:
{
  "isFood": false,
  "notFoodReason": "No food or drink detected in this photo. Please snap a picture of your meal."
}

Step 2: If food or drink IS present:
Identify each food item, portion size, calories, and total macronutrients.
Respond STRICTLY with this JSON:
{
  "isFood": true,
  "title": "Short descriptive name of the meal (e.g. Grilled Chicken, Rice & Salad)",
  "totalKcal": 650,
  "carbsGrams": 65,
  "proteinGrams": 40,
  "fatGrams": 18,
  "items": [
    {
      "name": "Grilled chicken breast",
      "portion": "about 150 g",
      "kcal": 250
    },
    {
      "name": "White rice",
      "portion": "about 1 cup",
      "kcal": 220
    },
    {
      "name": "Mixed green salad",
      "portion": "about 1 bowl",
      "kcal": 180
    }
  ]
}

DO NOT include any Markdown backticks, explanations, or conversational text. Return only valid JSON.`;

  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hfToken}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: formattedImageUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepSeek Vision API error response:', response.status, errorText);
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const jsonResponse = await response.json();
  const rawContent = jsonResponse.choices?.[0]?.message?.content || '';

  // Clean any markdown wrapper (```json ... ```)
  const cleaned = rawContent
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (parsed.isFood === false) {
      return {
        isFood: false,
        notFoodReason: parsed.notFoodReason || 'No food or drink detected in this photo.',
        title: 'No Food Detected',
        totalKcal: 0,
        carbsGrams: 0,
        proteinGrams: 0,
        fatGrams: 0,
        items: [],
      };
    }

    const totalKcal = Number(parsed.totalKcal) || 500;
    const carbsGrams = Number(parsed.carbsGrams) || Math.round((totalKcal * 0.4) / 4);
    const proteinGrams = Number(parsed.proteinGrams) || Math.round((totalKcal * 0.3) / 4);
    const fatGrams = Number(parsed.fatGrams) || Math.round((totalKcal * 0.3) / 9);

    const items = Array.isArray(parsed.items) && parsed.items.length > 0
      ? parsed.items.map((item: any) => ({
          name: String(item.name || 'Food item'),
          portion: String(item.portion || '1 serving'),
          kcal: Number(item.kcal) || Math.round(totalKcal / parsed.items.length),
        }))
      : [
          { name: parsed.title || 'Meal', portion: '1 plate', kcal: totalKcal }
        ];

    return {
      isFood: true,
      title: parsed.title || 'Analyzed Meal',
      totalKcal,
      carbsGrams,
      proteinGrams,
      fatGrams,
      items,
    };
  } catch (err) {
    console.error('Failed to parse DeepSeek response as JSON:', rawContent, err);
    throw new Error('Failed to parse AI response as valid meal data');
  }
}
