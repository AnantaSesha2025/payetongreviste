import { create } from 'zustand'

/**
 * Profile type representing a user profile in the app
 */
export type Profile = {
  /** Unique identifier for the profile */
  id: string
  /** Display name of the profile */
  name: string
  /** Age of the profile */
  age: number
  /** Bio text description */
  bio: string
  /** URL to the profile photo */
  photoUrl: string
  /** Geographic location coordinates */
  location: { lat: number; lon: number }
  /** Strike fund information */
  strikeFund: { url: string; title: string }
}

/**
 * Application state type managed by Zustand store
 */
type AppState = {
  /** Array of all profiles in the app */
  profiles: Profile[]
  /** Set of profile IDs that have been liked */
  likedIds: Set<string>
  /** Set of profile IDs that have been passed */
  passedIds: Set<string>
  /** Chat messages organized by profile ID */
  chats: Record<string, { from: 'bot' | 'user'; text: string; ts: number }[]>
  /** Current user profile */
  currentUser: Profile | null
  /** Function to like a profile and initialize chat */
  likeProfile: (id: string) => void
  /** Function to pass on a profile */
  passProfile: (id: string) => void
  /** Function to set all profiles */
  setProfiles: (profiles: Profile[]) => void
  /** Function to ensure a chat exists for a profile */
  ensureChatFor: (id: string) => void
  /** Function to add a user message to a chat */
  addUserMessage: (id: string, text: string) => void
  /** Function to create or update a profile */
  upsertProfile: (profile: Profile) => void
  /** Function to remove a profile */
  removeProfile: (id: string) => void
  /** Function to update current user profile */
  updateUserProfile: (profile: Profile) => void
  /** Function to delete current user profile */
  deleteUserProfile: () => void
  /** Check if user profile is complete */
  isProfileComplete: () => boolean
}

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
  likeProfile: (id) => set((state) => {
    const next = new Set(state.likedIds)
    next.add(id)
    const chats = { ...state.chats }
    if (!chats[id]) {
      // Find the profile to get strike fund information
      const profile = state.profiles.find(p => p.id === id)
      const strikeFundLink = profile ? profile.strikeFund.url : '#'
      const strikeFundTitle = profile ? profile.strikeFund.title : 'Strike Fund'
      
      chats[id] = [
        { 
          from: 'bot', 
          text: `Hey! Thanks for the support ❤️ — here's the link to help fund the strike: ${strikeFundTitle}`, 
          ts: Date.now() 
        },
        { 
          from: 'bot', 
          text: `🔗 ${strikeFundLink}`, 
          ts: Date.now() + 1 
        },
      ]
    }
    return { likedIds: next, chats }
  }),
  
  /**
   * Passes on a profile (adds to passed set)
   * @param id - Profile ID to pass
   */
  passProfile: (id) => set((state) => {
    const next = new Set(state.passedIds)
    next.add(id)
    return { passedIds: next }
  }),
  
  /**
   * Sets all profiles in the store
   * @param profiles - Array of profiles to set
   */
  setProfiles: (profiles) => set({ profiles }),
  
  /**
   * Ensures a chat exists for a profile with a default message
   * @param id - Profile ID to ensure chat for
   */
  ensureChatFor: (id) => set((state) => {
    if (state.chats[id]) return {}
    
    // Find the profile to get strike fund information
    const profile = state.profiles.find(p => p.id === id)
    const strikeFundLink = profile ? profile.strikeFund.url : '#'
    const strikeFundTitle = profile ? profile.strikeFund.title : 'Strike Fund'
    
    return { 
      chats: { 
        ...state.chats, 
        [id]: [
          { from: 'bot', text: 'Hey! Appreciate you stopping by ✊', ts: Date.now() },
          { from: 'bot', text: `Here's the link to support the cause: ${strikeFundTitle}`, ts: Date.now() + 1 },
          { from: 'bot', text: `🔗 ${strikeFundLink}`, ts: Date.now() + 2 }
        ] 
      } 
    }
  }),
  
  /**
   * Adds a user message to a chat
   * @param id - Profile ID to add message to
   * @param text - Message text to add
   */
  addUserMessage: (id, text) => set((state) => {
    const current = state.chats[id] ?? []
    return { chats: { ...state.chats, [id]: [...current, { from: 'user', text, ts: Date.now() }] } }
  }),
  
  /**
   * Creates or updates a profile
   * @param profile - Profile to create or update
   */
  upsertProfile: (profile) => set((state) => {
    const idx = state.profiles.findIndex(p => p.id === profile.id)
    if (idx >= 0) {
      const next = state.profiles.slice()
      next[idx] = profile
      return { profiles: next }
    }
    return { profiles: [...state.profiles, profile] }
  }),
  
  /**
   * Removes a profile from the store
   * @param id - Profile ID to remove
   */
  removeProfile: (id) => set((state) => ({ profiles: state.profiles.filter(p => p.id !== id) })),
  
  /**
   * Updates the current user profile
   * @param profile - Profile to set as current user
   */
  updateUserProfile: (profile) => set({ currentUser: profile }),
  
  /**
   * Deletes the current user profile
   */
  deleteUserProfile: () => set({ currentUser: null }),
  
  /**
   * Check if user profile is complete
   */
  isProfileComplete: () => {
    const state = get()
    return !!(
      state.currentUser &&
      state.currentUser.name &&
      state.currentUser.bio &&
      state.currentUser.photoUrl &&
      state.currentUser.strikeFund.title &&
      state.currentUser.strikeFund.url
    )
  },
}))

/**
 * Mock profiles for development and demonstration purposes
 * These are sample profiles that appear in the swipe interface
 */
export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Alex',
    age: 26,
    bio: 'Coffee lover, runner, and movie nerd.',
    photoUrl: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=80&auto=format&fit=crop',
    location: { lat: 48.8566, lon: 2.3522 },
    strikeFund: { url: 'https://exemple.org/fund/strike-a', title: 'Transit Workers Strike Fund' },
  },
  {
    id: '2',
    name: 'Sam',
    age: 29,
    bio: 'Foodie exploring new restaurants every week.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop',
    location: { lat: 48.8666, lon: 2.3333 },
    strikeFund: { url: 'https://exemple.org/fund/strike-b', title: 'Nurses Collective Action' },
  },
  {
    id: '3',
    name: 'Taylor',
    age: 24,
    bio: 'Designer by day, musician by night.',
    photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop',
    location: { lat: 48.853, lon: 2.3499 },
    strikeFund: { url: 'https://exemple.org/fund/strike-c', title: 'Teachers Solidarity Fund' },
  },
]


