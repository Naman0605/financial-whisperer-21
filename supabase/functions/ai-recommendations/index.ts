
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();
    
    console.log("Received user data:", userData);
    
    // Format the prompt with the user's financial data
    const prompt = `
    I have a user with the following financial information:
    
    Expenses:
    ${userData.expenses.map(exp => `- ${exp.name}: ₹${exp.amount}`).join('\n')}
    
    Savings Goals:
    ${userData.goals.map(goal => `- ${goal.name}: ₹${goal.target}`).join('\n')}
    
    Based on this information, provide the following in JSON format:
    1. Top 3-4 personalized financial recommendations to help them save money
    2. Analysis of their spending patterns
    3. A strategy for reaching their savings goals faster
    
    Format the response as a JSON object with the following structure:
    {
      "recommendations": [
        { "title": "string", "description": "string", "savings": "string", "icon": "string" }
      ],
      "analysis": "string",
      "savingsStrategy": "string"
    }
    
    For the icon field, use one of: "Trash", "Repeat", "CreditCard", "Calendar", "ShoppingBag", "Smartphone", "Utensils"
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a financial advisor assistant that generates personalized financial recommendations based on user data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    console.log("OpenAI response received");
    
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse the JSON from the AI response
    let parsedResponse;
    try {
      // Find JSON content by looking for opening and closing braces
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", aiResponse);
      
      // Provide a fallback structured response
      parsedResponse = {
        recommendations: [
          { 
            title: "Review Your Budget", 
            description: "Based on your expenses, we recommend reviewing your monthly budget.",
            savings: "Varies",
            icon: "CreditCard"
          }
        ],
        analysis: "We couldn't analyze your spending patterns in detail. Please provide more information.",
        savingsStrategy: "Start by setting aside a small amount each month toward your savings goals."
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
