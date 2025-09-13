import { create } from 'zustand';
import { getActiveFunds } from './lib/strikeFunds';

/**
 * Profile type representing a user profile in the app
 */
export type Profile = {
  /** Unique identifier for the profile */
  id: string;
  /** Display name of the profile */
  name: string;
  /** Age of the profile */
  age: number;
  /** Bio text description */
  bio: string;
  /** URL to the profile photo */
  photoUrl: string;
  /** Geographic location coordinates */
  location: { lat: number; lon: number };
  /** Strike fund information */
  strikeFund: {
    id: string;
    url: string;
    title: string;
    description: string;
    category: string;
    urgency: string;
    currentAmount: number;
    targetAmount: number;
  };
};

/**
 * Application state type managed by Zustand store
 */
type AppState = {
  /** Array of all profiles in the app */
  profiles: Profile[];
  /** Set of profile IDs that have been liked */
  likedIds: Set<string>;
  /** Set of profile IDs that have been passed */
  passedIds: Set<string>;
  /** Chat messages organized by profile ID */
  chats: Record<string, { from: 'bot' | 'user'; text: string; ts: number }[]>;
  /** Current user profile */
  currentUser: Profile | null;
  /** Function to like a profile and initialize chat */
  likeProfile: (id: string) => void;
  /** Function to pass on a profile */
  passProfile: (id: string) => void;
  /** Function to set all profiles */
  setProfiles: (profiles: Profile[]) => void;
  /** Function to ensure a chat exists for a profile */
  ensureChatFor: (id: string) => void;
  /** Function to add a user message to a chat */
  addUserMessage: (id: string, text: string) => void;
  /** Function to create or update a profile */
  upsertProfile: (profile: Profile) => void;
  /** Function to remove a profile */
  removeProfile: (id: string) => void;
  /** Function to update current user profile */
  updateUserProfile: (profile: Profile) => void;
  /** Function to delete current user profile */
  deleteUserProfile: () => void;
  /** Check if user profile is complete */
  isProfileComplete: () => boolean;
};

/**
 * Zustand store for managing application state
 * Handles profiles, likes, passes, and chat functionality
 */
export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  likedIds: new Set<string>(),
  passedIds: new Set<string>(),
  chats: {},
  currentUser: null,

  /**
   * Likes a profile and initializes a chat with a welcome message
   * @param id - Profile ID to like
   */
  likeProfile: id =>
    set(state => {
      const next = new Set(state.likedIds);
      next.add(id);
      const chats = { ...state.chats };
      if (!chats[id]) {
        // Find the profile to get strike fund information
        const profile = state.profiles.find(p => p.id === id);
        const strikeFundLink = profile ? profile.strikeFund.url : '#';
        const strikeFundTitle = profile
          ? profile.strikeFund.title
          : 'Strike Fund';
        const strikeFundDescription = profile
          ? profile.strikeFund.description
          : 'Support this cause';

        chats[id] = [
          {
            from: 'bot',
            text: `Hey! Thanks for the support ❤️ — here's the link to help fund the strike: ${strikeFundTitle}`,
            ts: Date.now(),
          },
          {
            from: 'bot',
            text: `${strikeFundDescription}`,
            ts: Date.now() + 1,
          },
          {
            from: 'bot',
            text: `🔗 ${strikeFundLink}`,
            ts: Date.now() + 2,
          },
        ];
      }
      return { likedIds: next, chats };
    }),

  /**
   * Passes on a profile (adds to passed set)
   * @param id - Profile ID to pass
   */
  passProfile: id =>
    set(state => {
      const next = new Set(state.passedIds);
      next.add(id);
      return { passedIds: next };
    }),

  /**
   * Sets all profiles in the store
   * @param profiles - Array of profiles to set
   */
  setProfiles: profiles => set({ profiles }),

  /**
   * Ensures a chat exists for a profile with a default message
   * @param id - Profile ID to ensure chat for
   */
  ensureChatFor: id =>
    set(state => {
      if (state.chats[id]) return {};

      // Find the profile to get strike fund information
      const profile = state.profiles.find(p => p.id === id);
      const strikeFundLink = profile ? profile.strikeFund.url : '#';
      const strikeFundTitle = profile
        ? profile.strikeFund.title
        : 'Strike Fund';
      const strikeFundDescription = profile
        ? profile.strikeFund.description
        : 'Support this cause';

      return {
        chats: {
          ...state.chats,
          [id]: [
            {
              from: 'bot',
              text: 'Hey! Appreciate you stopping by ✊',
              ts: Date.now(),
            },
            {
              from: 'bot',
              text: `Here's the link to support the cause: ${strikeFundTitle}`,
              ts: Date.now() + 1,
            },
            {
              from: 'bot',
              text: `${strikeFundDescription}`,
              ts: Date.now() + 2,
            },
            { from: 'bot', text: `🔗 ${strikeFundLink}`, ts: Date.now() + 3 },
          ],
        },
      };
    }),

  /**
   * Adds a user message to a chat
   * @param id - Profile ID to add message to
   * @param text - Message text to add
   */
  addUserMessage: (id, text) =>
    set(state => {
      const current = state.chats[id] ?? [];
      return {
        chats: {
          ...state.chats,
          [id]: [...current, { from: 'user', text, ts: Date.now() }],
        },
      };
    }),

  /**
   * Creates or updates a profile
   * @param profile - Profile to create or update
   */
  upsertProfile: profile =>
    set(state => {
      const idx = state.profiles.findIndex(p => p.id === profile.id);
      if (idx >= 0) {
        const next = state.profiles.slice();
        next[idx] = profile;
        return { profiles: next };
      }
      return { profiles: [...state.profiles, profile] };
    }),

  /**
   * Removes a profile from the store
   * @param id - Profile ID to remove
   */
  removeProfile: id =>
    set(state => ({ profiles: state.profiles.filter(p => p.id !== id) })),

  /**
   * Updates the current user profile
   * @param profile - Profile to set as current user
   */
  updateUserProfile: profile => set({ currentUser: profile }),

  /**
   * Deletes the current user profile
   */
  deleteUserProfile: () => set({ currentUser: null }),

  /**
   * Check if user profile is complete
   */
  isProfileComplete: () => {
    const state = get();
    return !!(
      state.currentUser &&
      state.currentUser.name &&
      state.currentUser.bio &&
      state.currentUser.photoUrl &&
      state.currentUser.strikeFund.title &&
      state.currentUser.strikeFund.url
    );
  },
}));

/**
 * Generate fake profiles connected to real Strike funds
 * These profiles represent different causes and connect to actual donation pages
 */
export function generateMockProfiles(): Profile[] {
  const activeFunds = getActiveFunds();

  return [
    {
      id: '1',
      name: 'Alex',
      age: 26,
      bio: 'Conducteur de métro en grève pour défendre nos conditions de travail. Solidarité avec tous les travailleurs !',
      photoUrl:
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=80&auto=format&fit=crop',
      location: { lat: 48.8566, lon: 2.3522 },
      strikeFund: {
        id: activeFunds[0]?.id || 'fund-001',
        url:
          activeFunds[0]?.url ||
          'https://www.helloasso.com/associations/solidarite-transports/collectes/fonds-de-greve-transports-parisiens',
        title:
          activeFunds[0]?.title || 'Fonds de Grève des Transports Parisiens',
        description:
          activeFunds[0]?.description ||
          'Soutien aux travailleurs des transports en grève',
        category: activeFunds[0]?.category || 'transport',
        urgency: activeFunds[0]?.urgency || 'high',
        currentAmount: activeFunds[0]?.currentAmount || 32450,
        targetAmount: activeFunds[0]?.targetAmount || 50000,
      },
    },
    {
      id: '2',
      name: 'Sam',
      age: 29,
      bio: "Enseignante en lutte pour défendre l'éducation publique. Nos enfants méritent mieux !",
      photoUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop',
      location: { lat: 48.8666, lon: 2.3333 },
      strikeFund: {
        id: activeFunds[1]?.id || 'fund-002',
        url:
          activeFunds[1]?.url ||
          'https://www.helloasso.com/associations/solidarite-education/collectes/caisse-solidarite-enseignants',
        title: activeFunds[1]?.title || 'Caisse de Solidarité des Enseignants',
        description:
          activeFunds[1]?.description ||
          'Fonds de solidarité pour les enseignants en grève',
        category: activeFunds[1]?.category || 'education',
        urgency: activeFunds[1]?.urgency || 'medium',
        currentAmount: activeFunds[1]?.currentAmount || 18750,
        targetAmount: activeFunds[1]?.targetAmount || 30000,
      },
    },
    {
      id: '3',
      name: 'Taylor',
      age: 24,
      bio: "Infirmière en première ligne. L'hôpital public doit être sauvé ! Solidarité avec tous les soignants.",
      photoUrl:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop',
      location: { lat: 48.853, lon: 2.3499 },
      strikeFund: {
        id: activeFunds[2]?.id || 'fund-003',
        url:
          activeFunds[2]?.url ||
          'https://www.helloasso.com/associations/solidarite-sante/collectes/soutien-soignants-lutte',
        title: activeFunds[2]?.title || 'Soutien aux Soignants en Lutte',
        description:
          activeFunds[2]?.description ||
          'Fonds de soutien aux personnels soignants en grève',
        category: activeFunds[2]?.category || 'health',
        urgency: activeFunds[2]?.urgency || 'critical',
        currentAmount: activeFunds[2]?.currentAmount || 45600,
        targetAmount: activeFunds[2]?.targetAmount || 75000,
      },
    },
    {
      id: '4',
      name: 'Jordan',
      age: 31,
      bio: "Militant écologiste en lutte pour la justice climatique. Il est temps d'agir !",
      photoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
      location: { lat: 48.8606, lon: 2.3376 },
      strikeFund: {
        id: activeFunds[3]?.id || 'fund-004',
        url:
          activeFunds[3]?.url ||
          'https://www.helloasso.com/associations/climat-justice/collectes/fonds-climat-justice-sociale',
        title: activeFunds[3]?.title || 'Fonds Climat et Justice Sociale',
        description:
          activeFunds[3]?.description ||
          'Soutien aux mouvements écologistes et sociaux',
        category: activeFunds[3]?.category || 'environment',
        urgency: activeFunds[3]?.urgency || 'high',
        currentAmount: activeFunds[3]?.currentAmount || 22300,
        targetAmount: activeFunds[3]?.targetAmount || 40000,
      },
    },
    {
      id: '5',
      name: 'Casey',
      age: 27,
      bio: 'Serveur en grève pour de meilleures conditions. La restauration mérite le respect !',
      photoUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop',
      location: { lat: 48.8529, lon: 2.3499 },
      strikeFund: {
        id: activeFunds[4]?.id || 'fund-005',
        url:
          activeFunds[4]?.url ||
          'https://www.helloasso.com/associations/solidarite-restauration/collectes/caisse-greve-restaurateurs',
        title: activeFunds[4]?.title || 'Caisse de Grève des Restaurateurs',
        description:
          activeFunds[4]?.description ||
          'Soutien aux restaurateurs et employés de la restauration',
        category: activeFunds[4]?.category || 'food',
        urgency: activeFunds[4]?.urgency || 'medium',
        currentAmount: activeFunds[4]?.currentAmount || 12800,
        targetAmount: activeFunds[4]?.targetAmount || 25000,
      },
    },
  ];
}

// Export the generated profiles
export const mockProfiles: Profile[] = generateMockProfiles();
