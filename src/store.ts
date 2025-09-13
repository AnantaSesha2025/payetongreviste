import { create } from 'zustand'

export type Profile = {
  id: string
  name: string
  age: number
  bio: string
  photoUrl: string
  location: { lat: number; lon: number }
  strikeFund: { url: string; title: string }
}

type AppState = {
  profiles: Profile[]
  likedIds: Set<string>
  passedIds: Set<string>
  chats: Record<string, { from: 'bot' | 'user'; text: string; ts: number }[]>
  likeProfile: (id: string) => void
  passProfile: (id: string) => void
  setProfiles: (profiles: Profile[]) => void
  ensureChatFor: (id: string) => void
  addUserMessage: (id: string, text: string) => void
  upsertProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  likedIds: new Set<string>(),
  passedIds: new Set<string>(),
  chats: {},
  likeProfile: (id) => set((state) => {
    const next = new Set(state.likedIds)
    next.add(id)
    const chats = { ...state.chats }
    if (!chats[id]) {
      chats[id] = [
        { from: 'bot', text: 'Hey! Thanks for the support ❤️ — quick link below helps fund the strike.', ts: Date.now() },
      ]
    }
    return { likedIds: next, chats }
  }),
  passProfile: (id) => set((state) => {
    const next = new Set(state.passedIds)
    next.add(id)
    return { passedIds: next }
  }),
  setProfiles: (profiles) => set({ profiles }),
  ensureChatFor: (id) => set((state) => {
    if (state.chats[id]) return {}
    return { chats: { ...state.chats, [id]: [{ from: 'bot', text: 'Hey! Appreciate you stopping by ✊', ts: Date.now() }] } }
  }),
  addUserMessage: (id, text) => set((state) => {
    const current = state.chats[id] ?? []
    return { chats: { ...state.chats, [id]: [...current, { from: 'user', text, ts: Date.now() }] } }
  }),
  upsertProfile: (profile) => set((state) => {
    const idx = state.profiles.findIndex(p => p.id === profile.id)
    if (idx >= 0) {
      const next = state.profiles.slice()
      next[idx] = profile
      return { profiles: next }
    }
    return { profiles: [...state.profiles, profile] }
  }),
  removeProfile: (id) => set((state) => ({ profiles: state.profiles.filter(p => p.id !== id) })),
}))

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


