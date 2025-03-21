
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
    const { message, financialContext } = await req.json();
    
    console.log("Received message:", message);
    console.log("Financial context:", financialContext);
    
    if (!openAIApiKey) {
      console.error("Missing OpenAI API key");
      return new Response(JSON.stringify({ 
        error: "OpenAI API key is not configured",
        response: "I'm sorry, I'm not able to process your request right now. Please try again later." 
      }), {
        status: 200, // Return 200 with fallback message instead of 500
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!message || message.trim() === '') {
      return new Response(JSON.stringify({ 
        response: "Please provide a message to get financial advice." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Create a system prompt that includes the user's financial data
    let systemPrompt = "You are a helpful financial assistant that provides personalized advice.";
    
    if (financialContext?.expenses?.length > 0 || financialContext?.goals?.length > 0) {
      systemPrompt += " Here is some context about the user's finances:\n\n";
      
      if (financialContext.expenses?.length > 0) {
        systemPrompt += "Expenses:\n";
        systemPrompt += financialContext.expenses.map(exp => `- ${exp.name}: ₹${exp.amount}`).join('\n');
        systemPrompt += "\n\n";
      }
      
      if (financialContext.goals?.length > 0) {
        systemPrompt += "Savings Goals:\n";
        systemPrompt += financialContext.goals.map(goal => `- ${goal.name}: ₹${goal.target}`).join('\n');
        systemPrompt += "\n\n";
      }
    }
    
    systemPrompt += "Provide helpful, personalized financial advice based on this information. Keep responses concise and actionable.";

    console.log("Sending message to OpenAI");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: Status ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      chart: message.toLowerCase().includes('spending') || message.toLowerCase().includes('budget') ? 'pie' : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I encountered an error while processing your request. Please try again later."
    }), {
      status: 200, // Return 200 with error message instead of 500
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
