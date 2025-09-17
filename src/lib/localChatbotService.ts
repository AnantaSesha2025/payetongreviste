/**
 * Local Chatbot Service using WebLLM (MLC-LLM)
 *
 * This service runs AI models entirely in the browser without external APIs.
 * Uses WebLLM for local inference with precise initialization prompts.
 */

import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm';

export interface ChatbotConfig {
  /** Profile information for context */
  profile: {
    id: string;
    name: string;
    age: number;
    bio: string;
    strikeFund: {
      title: string;
      description: string;
      category: string;
      urgency: string;
      currentAmount: number;
      targetAmount: number;
      url: string;
    };
  };
  /** Conversation history */
  messages: Array<{ from: 'user' | 'bot'; text: string; ts: number }>;
}

export interface ChatbotResponse {
  text: string;
  shouldRedirectToFund?: boolean;
}

/**
 * Local AI Engine instance
 */
let localEngine: MLCEngineInterface | null = null;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the local AI engine
 */
async function initializeEngine(): Promise<void> {
  if (localEngine) return;
  if (isInitializing) {
    await initializationPromise;
    return;
  }

  isInitializing = true;
  initializationPromise = (async () => {
    try {
      console.log('🤖 Initializing local AI engine...');

      // Use a lightweight model that works well in browsers
      // Llama-3-8B-Instruct is a good balance of quality and size
      localEngine = await CreateMLCEngine('Llama-3-8B-Instruct-q4f16_1-MLC');

      console.log('✅ Local AI engine initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize local AI engine:', error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();

  await initializationPromise;
}

/**
 * Generate a personalized system prompt for each fake profile
 */
function generateSystemPrompt(config: ChatbotConfig): string {
  const { profile } = config;
  const { strikeFund } = profile;

  // Calculate progress percentage
  const progress = Math.round(
    (strikeFund.currentAmount / strikeFund.targetAmount) * 100
  );

  // Generate personality based on profile characteristics
  const personality = generatePersonality(profile);

  return `Tu es ${profile.name}, ${profile.age} ans. ${profile.bio}

INFORMATIONS IMPORTANTES SUR TON PROFIL:
- Nom: ${profile.name}
- Âge: ${profile.age}
- Bio: ${profile.bio}
- Cause: ${strikeFund.title}
- Description de la cause: ${strikeFund.description}
- Catégorie: ${strikeFund.category}
- Urgence: ${strikeFund.urgency}
- Montant actuel: ${strikeFund.currentAmount}€
- Objectif: ${strikeFund.targetAmount}€
- Progression: ${progress}%
- Lien de soutien: ${strikeFund.url}

PERSONNALITÉ ET STYLE DE COMMUNICATION:
${personality}

RÈGLES IMPORTANTES:
1. Tu es un profil FICTIF mais tu représentes une VRAIE cause
2. Parle toujours en français, de manière naturelle et engageante
3. Sois passionné(e) par ta cause mais reste respectueux(se)
4. Mentionne régulièrement le lien de soutien: ${strikeFund.url}
5. Explique pourquoi ta cause est importante
6. Encourage le soutien mais ne sois pas trop insistant(e)
7. Réponds aux questions sur les grèves, les conditions de travail, etc.
8. Reste dans le personnage de ${profile.name}
9. Si on te demande des infos personnelles, invente des détails cohérents avec ton profil
10. Termine parfois tes messages par des emojis liés à ta cause

EXEMPLES DE RÉPONSES:
- "Salut ! Merci de t'intéresser à notre cause ! 😊"
- "C'est génial que tu veuilles nous soutenir ! Chaque euro compte ✊"
- "Tu peux nous aider ici: ${strikeFund.url}"
- "Notre grève est cruciale pour défendre nos droits !"

Reste authentique, passionné(e) et engageant(e) !`;
}

/**
 * Generate personality traits based on profile characteristics
 */
function generatePersonality(profile: {
  name: string;
  age: number;
  bio: string;
  strikeFund: { category: string; urgency: string };
}): string {
  const { age, strikeFund } = profile;

  // Age-based personality
  let agePersonality = '';
  if (age < 25) {
    agePersonality =
      'Tu es jeune, énergique et idéaliste. Tu utilises des expressions modernes et des emojis.';
  } else if (age < 35) {
    agePersonality =
      "Tu es dans la force de l'âge, déterminé(e) et expérimenté(e). Tu balances entre sérieux et décontracté.";
  } else {
    agePersonality =
      'Tu es expérimenté(e) et sage, mais toujours passionné(e). Tu parles avec autorité mais bienveillance.';
  }

  // Category-based personality
  let categoryPersonality = '';
  switch (strikeFund.category) {
    case 'transport':
      categoryPersonality =
        'Tu es un(e) travailleur(se) des transports, tu connais bien les enjeux de la mobilité et de la sécurité.';
      break;
    case 'education':
      categoryPersonality =
        'Tu es enseignant(e), tu es pédagogue et tu expliques bien les choses. Tu utilises des métaphores éducatives.';
      break;
    case 'health':
      categoryPersonality =
        "Tu es soignant(e), tu es empathique et tu comprends l'urgence des situations. Tu parles de solidarité.";
      break;
    case 'environment':
      categoryPersonality =
        'Tu es militant(e) écologiste, tu es passionné(e) par la planète et tu utilises un vocabulaire écologique.';
      break;
    case 'food':
      categoryPersonality =
        'Tu travailles dans la restauration, tu es chaleureux(se) et tu parles de convivialité et de respect.';
      break;
    default:
      categoryPersonality =
        'Tu es un(e) travailleur(se) engagé(e), tu défends tes droits avec passion.';
  }

  // Urgency-based tone
  let urgencyTone = '';
  switch (strikeFund.urgency) {
    case 'critical':
      urgencyTone =
        "Tu es très urgent(e) et tu insistes sur l'importance de l'aide immédiate.";
      break;
    case 'high':
      urgencyTone = 'Tu es pressé(e) mais tu restes calme et organisé(e).';
      break;
    case 'medium':
      urgencyTone = "Tu es déterminé(e) mais tu prends le temps d'expliquer.";
      break;
    case 'low':
      urgencyTone = 'Tu es patient(e) et tu expliques calmement ta cause.';
      break;
  }

  return `${agePersonality} ${categoryPersonality} ${urgencyTone}`;
}

/**
 * Call local AI engine to get response
 */
async function callLocalAI(
  prompt: string,
  userMessage: string
): Promise<string> {
  try {
    // Ensure engine is initialized
    await initializeEngine();

    if (!localEngine) {
      throw new Error('Local AI engine not initialized');
    }

    // Prepare messages for the AI
    const messages = [
      { role: 'system' as const, content: prompt },
      { role: 'user' as const, content: userMessage },
    ];

    // Get response from local AI
    const response = await localEngine.chat.completions.create({
      messages,
      temperature: 0.8,
      max_tokens: 150,
      top_p: 0.9,
    });

    return (
      response.choices[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer de réponse."
    );
  } catch (error) {
    console.error('Local AI Error:', error);
    throw error;
  }
}

/**
 * Generate fallback response when AI fails
 */
function generateFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Greeting responses
  if (
    lowerMessage.includes('salut') ||
    lowerMessage.includes('bonjour') ||
    lowerMessage.includes('coucou')
  ) {
    return "Salut ! Merci de t'intéresser à notre cause ! 😊";
  }

  // Questions about strike fund
  if (
    lowerMessage.includes('cause') ||
    lowerMessage.includes('grève') ||
    lowerMessage.includes('lutte')
  ) {
    return 'Notre grève est cruciale pour défendre nos droits ! Chaque soutien compte énormément ✊';
  }

  // Questions about support
  if (
    lowerMessage.includes('soutenir') ||
    lowerMessage.includes('aider') ||
    lowerMessage.includes('don')
  ) {
    return "C'est génial que tu veuilles nous soutenir ! Tu peux faire un don via le lien dans mon profil 💪";
  }

  // Questions about money/funds
  if (
    lowerMessage.includes('argent') ||
    lowerMessage.includes('euro') ||
    lowerMessage.includes('donation')
  ) {
    return "Chaque euro compte pour nous aider à tenir ! La solidarité c'est la force des travailleurs 💰";
  }

  // Default response
  const responses = [
    'Merci pour ton message ! Notre cause est vraiment importante 😊',
    "C'est super de discuter avec toi ! Tu peux nous soutenir via le lien dans mon profil ✊",
    "Je suis content(e) que tu t'intéresses à notre lutte ! 💪",
    'Notre grève est nécessaire pour défendre nos droits ! 🔥',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Main function to get chatbot response using local AI
 */
export async function getLocalChatbotResponse(
  config: ChatbotConfig,
  userMessage: string
): Promise<ChatbotResponse> {
  try {
    // Generate system prompt for this specific profile
    const systemPrompt = generateSystemPrompt(config);

    // Try to get local AI response
    const aiResponse = await callLocalAI(systemPrompt, userMessage);

    // Check if response should redirect to fund
    const shouldRedirect = shouldRedirectToFund(userMessage, aiResponse);

    return {
      text: aiResponse,
      shouldRedirectToFund: shouldRedirect,
    };
  } catch (error) {
    console.error('Local chatbot error:', error);

    // Fallback to simple response
    return {
      text: generateFallbackResponse(userMessage),
      shouldRedirectToFund: false,
    };
  }
}

/**
 * Determine if the response should redirect to the strike fund
 */
function shouldRedirectToFund(
  userMessage: string,
  aiResponse: string
): boolean {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  // Keywords that suggest user wants to support
  const supportKeywords = [
    'soutenir',
    'aider',
    'don',
    'donation',
    'argent',
    'euro',
    'contribution',
    'participer',
    'donner',
    'verser',
    'payer',
    'financer',
  ];

  // Check if user message contains support keywords
  const hasSupportIntent = supportKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  // Check if AI response mentions the fund
  const mentionsFund =
    lowerResponse.includes('lien') ||
    lowerResponse.includes('url') ||
    lowerResponse.includes('soutenir');

  return hasSupportIntent || mentionsFund;
}

/**
 * Generate initial welcome messages for a profile
 */
export function generateLocalWelcomeMessages(
  profile: ChatbotConfig['profile']
): Array<{ from: 'bot'; text: string; ts: number }> {
  const { name, strikeFund } = profile;
  const progress = Math.round(
    (strikeFund.currentAmount / strikeFund.targetAmount) * 100
  );

  const messages = [
    {
      from: 'bot' as const,
      text: `Salut ! Merci pour le match ! 😊 Je suis ${name} et je suis ravi(e) de te rencontrer !`,
      ts: Date.now(),
    },
    {
      from: 'bot' as const,
      text: `Je lutte pour ${strikeFund.title.toLowerCase()}. ${strikeFund.description}`,
      ts: Date.now() + 1,
    },
    {
      from: 'bot' as const,
      text: `Nous avons déjà récolté ${strikeFund.currentAmount}€ sur ${strikeFund.targetAmount}€ (${progress}%) ! Chaque soutien compte énormément ✊`,
      ts: Date.now() + 2,
    },
    {
      from: 'bot' as const,
      text: `Tu peux nous aider ici : ${strikeFund.url}`,
      ts: Date.now() + 3,
    },
  ];

  return messages;
}

/**
 * Check if local AI is available and ready
 */
export async function isLocalAIReady(): Promise<boolean> {
  try {
    await initializeEngine();
    return localEngine !== null;
  } catch (error) {
    console.error('Local AI not ready:', error);
    return false;
  }
}

/**
 * Get initialization status
 */
export function getInitializationStatus(): {
  isInitializing: boolean;
  isReady: boolean;
} {
  return {
    isInitializing,
    isReady: localEngine !== null,
  };
}
