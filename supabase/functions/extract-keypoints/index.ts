import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionId, question } = await req.json();
    console.log('Extracting keypoints for question:', questionId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all responses for this question
    const { data: responses, error: fetchError } = await supabase
      .from('user_responses')
      .select('response_text')
      .eq('question_id', questionId)
      .not('response_text', 'is', null);

    if (fetchError) {
      console.error('Error fetching responses:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch responses' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!responses || responses.length === 0) {
      console.log('No responses found');
      return new Response(JSON.stringify({ keypoints: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${responses.length} responses`);

    // Check if keypoints already exist for this question
    const { data: existingKeypoints } = await supabase
      .from('response_keypoints')
      .select('id, keypoint')
      .eq('question_id', questionId);

    if (existingKeypoints && existingKeypoints.length > 0) {
      console.log('Using existing keypoints');
      // Fetch like counts for existing keypoints
      const { data: likes } = await supabase
        .from('keypoint_likes')
        .select('keypoint_id');

      const likeCounts: { [key: string]: number } = {};
      if (likes) {
        likes.forEach((like) => {
          likeCounts[like.keypoint_id] = (likeCounts[like.keypoint_id] || 0) + 1;
        });
      }

      const keypointsWithLikes = existingKeypoints.map((kp) => ({
        id: kp.id,
        text: kp.keypoint,
        value: Math.max(10, (likeCounts[kp.id] || 0) * 5 + 10),
        likes: likeCounts[kp.id] || 0,
      }));

      return new Response(JSON.stringify({ keypoints: keypointsWithLikes }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract keypoints using AI
    const prompt = `Question: "${question}"

Here are all the responses from users:
${responses.map((r, i) => `${i + 1}. ${r.response_text}`).join('\n')}

Extract approximately one keypoint per response (${responses.length} total responses). Each keypoint should be:
- 1-3 words maximum
- A distinct, specific concept or theme
- Not repeated or too similar to other keypoints
- Readable and meaningful on its own

Combine similar concepts into single keypoints when appropriate. Return the keypoints as a simple JSON array of strings.

Example format: ["remote work", "health benefits", "flexible hours", "better communication", "time management"]`;

    console.log('Calling AI gateway for keypoint extraction');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a data analysis assistant that extracts key themes and concepts from survey responses. Always return valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'AI processing failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    console.log('AI response content:', content);

    // Parse keypoints from AI response
    let keypoints: string[] = [];
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      keypoints = JSON.parse(cleanedContent);
      
      if (!Array.isArray(keypoints)) {
        console.error('AI response is not an array');
        keypoints = [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: try to extract keypoints from text
      const matches = content.match(/"([^"]+)"/g);
      if (matches) {
        keypoints = matches.map((m: string) => m.replace(/"/g, ''));
      }
    }

    console.log(`Extracted ${keypoints.length} keypoints`);

    // Save keypoints to database
    if (keypoints.length > 0) {
      const keypointRecords = keypoints.slice(0, 20).map(kp => ({
        question_id: questionId,
        keypoint: kp,
      }));

      const { data: savedKeypoints, error: saveError } = await supabase
        .from('response_keypoints')
        .insert(keypointRecords)
        .select();

      if (saveError) {
        console.error('Error saving keypoints:', saveError);
      } else {
        console.log('Saved keypoints to database');
        const formattedKeypoints = (savedKeypoints || []).map((kp) => ({
          id: kp.id,
          text: kp.keypoint,
          value: 10,
          likes: 0,
        }));

        return new Response(JSON.stringify({ keypoints: formattedKeypoints }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ keypoints: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-keypoints function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
