import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store'
import type { Profile } from '../store'

describe('App Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
    })
  })

  describe('Profile Management', () => {
    it('should set profiles', () => {
      const profiles: Profile[] = [
        {
          id: '1',
          name: 'Test User',
          age: 25,
          bio: 'Test bio',
          photoUrl: 'https://example.com/photo.jpg',
          location: { lat: 48.8566, lon: 2.3522 },
          strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
        }
      ]

      useAppStore.getState().setProfiles(profiles)

      expect(useAppStore.getState().profiles).toEqual(profiles)
    })

    it('should upsert profile (create new)', () => {
      const profile: Profile = {
        id: '1',
        name: 'New User',
        age: 30,
        bio: 'New bio',
        photoUrl: 'https://example.com/new.jpg',
        location: { lat: 48.8666, lon: 2.3333 },
        strikeFund: { url: 'https://example.com/new-fund', title: 'New Fund' }
      }

      useAppStore.getState().upsertProfile(profile)

      expect(useAppStore.getState().profiles).toHaveLength(1)
      expect(useAppStore.getState().profiles[0]).toEqual(profile)
    })

    it('should upsert profile (update existing)', () => {
      const existingProfile: Profile = {
        id: '1',
        name: 'Original User',
        age: 25,
        bio: 'Original bio',
        photoUrl: 'https://example.com/original.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/original-fund', title: 'Original Fund' }
      }

      const updatedProfile: Profile = {
        ...existingProfile,
        name: 'Updated User',
        age: 26
      }

      // Add original profile
      useAppStore.getState().upsertProfile(existingProfile)
      expect(useAppStore.getState().profiles).toHaveLength(1)

      // Update profile
      useAppStore.getState().upsertProfile(updatedProfile)
      expect(useAppStore.getState().profiles).toHaveLength(1)
      expect(useAppStore.getState().profiles[0]).toEqual(updatedProfile)
    })

    it('should remove profile', () => {
      const profile: Profile = {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }

      // Add profile
      useAppStore.getState().upsertProfile(profile)
      expect(useAppStore.getState().profiles).toHaveLength(1)

      // Remove profile
      useAppStore.getState().removeProfile('1')
      expect(useAppStore.getState().profiles).toHaveLength(0)
    })
  })

  describe('Like/Pass Functionality', () => {
    it('should like profile and initialize chat', () => {
      const profile: Profile = {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }

      useAppStore.getState().upsertProfile(profile)
      useAppStore.getState().likeProfile('1')

      const state = useAppStore.getState()
      expect(state.likedIds.has('1')).toBe(true)
      expect(state.chats['1']).toBeDefined()
      expect(state.chats['1']).toHaveLength(1)
      expect(state.chats['1'][0].from).toBe('bot')
      expect(state.chats['1'][0].text).toContain('Thanks for the support')
    })

    it('should pass profile', () => {
      useAppStore.getState().passProfile('1')

      const state = useAppStore.getState()
      expect(state.passedIds.has('1')).toBe(true)
    })

    it('should not duplicate chat when liking same profile twice', () => {
      const profile: Profile = {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }

      useAppStore.getState().upsertProfile(profile)
      useAppStore.getState().likeProfile('1')
      useAppStore.getState().likeProfile('1') // Like again

      const state = useAppStore.getState()
      expect(state.chats['1']).toHaveLength(1) // Should still be only 1 message
    })
  })

  describe('Chat Functionality', () => {
    it('should ensure chat exists for profile', () => {
      useAppStore.getState().ensureChatFor('1')

      const state = useAppStore.getState()
      expect(state.chats['1']).toBeDefined()
      expect(state.chats['1']).toHaveLength(1)
      expect(state.chats['1'][0].from).toBe('bot')
      expect(state.chats['1'][0].text).toContain('Appreciate you stopping by')
    })

    it('should not create duplicate chat when ensuring chat exists', () => {
      useAppStore.getState().ensureChatFor('1')
      useAppStore.getState().ensureChatFor('1') // Ensure again

      const state = useAppStore.getState()
      expect(state.chats['1']).toHaveLength(1)
    })

    it('should add user message to chat', () => {
      useAppStore.getState().ensureChatFor('1')
      useAppStore.getState().addUserMessage('1', 'Hello!')

      const state = useAppStore.getState()
      expect(state.chats['1']).toHaveLength(2)
      expect(state.chats['1'][1].from).toBe('user')
      expect(state.chats['1'][1].text).toBe('Hello!')
    })

    it('should add multiple user messages', () => {
      useAppStore.getState().ensureChatFor('1')
      useAppStore.getState().addUserMessage('1', 'First message')
      useAppStore.getState().addUserMessage('1', 'Second message')

      const state = useAppStore.getState()
      expect(state.chats['1']).toHaveLength(3)
      expect(state.chats['1'][1].text).toBe('First message')
      expect(state.chats['1'][2].text).toBe('Second message')
    })
  })

  describe('State Isolation', () => {
    it('should maintain separate state for different profiles', () => {
      const profile1: Profile = {
        id: '1',
        name: 'User 1',
        age: 25,
        bio: 'Bio 1',
        photoUrl: 'https://example.com/1.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund1', title: 'Fund 1' }
      }

      const profile2: Profile = {
        id: '2',
        name: 'User 2',
        age: 30,
        bio: 'Bio 2',
        photoUrl: 'https://example.com/2.jpg',
        location: { lat: 48.8666, lon: 2.3333 },
        strikeFund: { url: 'https://example.com/fund2', title: 'Fund 2' }
      }

      useAppStore.getState().upsertProfile(profile1)
      useAppStore.getState().upsertProfile(profile2)
      useAppStore.getState().likeProfile('1')
      useAppStore.getState().passProfile('2')
      useAppStore.getState().addUserMessage('1', 'Hello to user 1')

      const state = useAppStore.getState()
      
      expect(state.likedIds.has('1')).toBe(true)
      expect(state.likedIds.has('2')).toBe(false)
      expect(state.passedIds.has('1')).toBe(false)
      expect(state.passedIds.has('2')).toBe(true)
      expect(state.chats['1']).toHaveLength(2) // Bot message + user message
      expect(state.chats['2']).toBeUndefined()
    })
  })
})
