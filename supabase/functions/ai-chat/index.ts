
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;

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
    // Verify auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(JSON.stringify({ 
        error: "Missing authorization header",
        response: "You need to be signed in to use this feature." 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with the token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get user to verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(JSON.stringify({ 
        error: "Authentication failed",
        response: "Your session has expired. Please sign in again." 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, financialContext } = await req.json();
    
    console.log("Received message:", message);
    console.log("Financial context:", financialContext);
    console.log("User ID:", user.id);
    
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
    
    // Fetch user's actual financial data if context is not provided
    if (!financialContext || (!financialContext.expenses && !financialContext.goals)) {
      try {
        // Get user's expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('name, amount, category')
          .eq('user_id', user.id);
        
        if (expensesError) throw expensesError;
        
        // Get user's goals
        const { data: goals, error: goalsError } = await supabase
          .from('goals')
          .select('name, target_amount, current_amount')
          .eq('user_id', user.id);
        
        if (goalsError) throw goalsError;
        
        // Format data for OpenAI context
        financialContext = {
          expenses: expenses || [],
          goals: goals ? goals.map(goal => ({
            name: goal.name,
            target: goal.target_amount,
            current: goal.current_amount
          })) : []
        };
        
        console.log("Fetched financial context:", financialContext);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        // Continue with empty context if there's an error
        financialContext = { expenses: [], goals: [] };
      }
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
        systemPrompt += financialContext.goals.map(goal => 
          `- ${goal.name}: ₹${goal.target}${goal.current ? ` (Current: ₹${goal.current})` : ''}`
        ).join('\n');
        systemPrompt += "\n\n";
      }
    }
    
    systemPrompt += "Provide helpful, personalized financial advice based on this information. Keep responses concise and actionable. Use Indian Rupees (₹) as the currency for all examples.";

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
