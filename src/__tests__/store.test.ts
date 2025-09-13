import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../store';
import type { Profile } from '../store';

// Mock profiles for testing
const mockProfile: Profile = {
  id: '1',
  name: 'Test User',
  age: 25,
  bio: 'Test bio',
  photoUrl: 'https://example.com/photo.jpg',
  location: { lat: 0, lon: 0 },
  strikeFund: { title: 'Test Fund', url: 'https://example.com/fund' },
};

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAppStore.getState().setProfiles([]);
      useAppStore.getState().likedIds.clear();
      useAppStore.getState().passedIds.clear();
      useAppStore.setState({ chats: {}, currentUser: null });
    });
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.profiles).toEqual([]);
    expect(result.current.likedIds.size).toBe(0);
    expect(result.current.passedIds.size).toBe(0);
    expect(result.current.chats).toEqual({});
    expect(result.current.currentUser).toBeNull();
  });

  it('sets profiles', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setProfiles([mockProfile]);
    });

    expect(result.current.profiles).toEqual([mockProfile]);
  });

  it('likes a profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setProfiles([mockProfile]);
      result.current.likeProfile('1');
    });

    expect(result.current.likedIds.has('1')).toBe(true);
    expect(result.current.chats['1']).toBeDefined();
    expect(result.current.chats['1']).toHaveLength(3); // Three bot messages
  });

  it('passes on a profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setProfiles([mockProfile]);
      result.current.passProfile('1');
    });

    expect(result.current.passedIds.has('1')).toBe(true);
  });

  it('creates or updates a profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.upsertProfile(mockProfile);
    });

    expect(result.current.profiles).toContain(mockProfile);
  });

  it('updates existing profile', () => {
    const { result } = renderHook(() => useAppStore());
    const updatedProfile = { ...mockProfile, name: 'Updated Name' };

    act(() => {
      result.current.upsertProfile(mockProfile);
      result.current.upsertProfile(updatedProfile);
    });

    expect(result.current.profiles).toHaveLength(1);
    expect(result.current.profiles[0].name).toBe('Updated Name');
  });

  it('removes a profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.upsertProfile(mockProfile);
      result.current.removeProfile('1');
    });

    expect(result.current.profiles).toHaveLength(0);
  });

  it('updates current user profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.updateUserProfile(mockProfile);
    });

    expect(result.current.currentUser).toEqual(mockProfile);
  });

  it('deletes current user profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.updateUserProfile(mockProfile);
      result.current.deleteUserProfile();
    });

    expect(result.current.currentUser).toBeNull();
  });

  it('checks if profile is complete', () => {
    const { result } = renderHook(() => useAppStore());

    // Test with incomplete profile
    act(() => {
      result.current.updateUserProfile({ ...mockProfile, name: '' });
    });

    expect(result.current.isProfileComplete()).toBe(false);

    // Test with complete profile
    act(() => {
      result.current.updateUserProfile(mockProfile);
    });

    expect(result.current.isProfileComplete()).toBe(true);
  });

  it('ensures chat exists for profile', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.ensureChatFor('1');
    });

    expect(result.current.chats['1']).toBeDefined();
    expect(result.current.chats['1']).toHaveLength(4); // Four bot messages
  });

  it('adds user message to chat', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.ensureChatFor('1');
      result.current.addUserMessage('1', 'Hello!');
    });

    expect(result.current.chats['1']).toHaveLength(5); // 4 bot messages + 1 user message
    expect(result.current.chats['1'][4]).toEqual({
      from: 'user',
      text: 'Hello!',
      ts: expect.any(Number),
    });
  });

  it('includes strike fund information in bot messages', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setProfiles([mockProfile]);
      result.current.likeProfile('1');
    });

    const chat = result.current.chats['1'];
    expect(chat[0].text).toContain(mockProfile.strikeFund.title);
    expect(chat[2].text).toContain(mockProfile.strikeFund.url);
  });

  it('handles multiple profiles correctly', () => {
    const { result } = renderHook(() => useAppStore());
    const profile2 = { ...mockProfile, id: '2', name: 'User 2' };

    act(() => {
      result.current.upsertProfile(mockProfile);
      result.current.upsertProfile(profile2);
    });

    expect(result.current.profiles).toHaveLength(2);
    expect(result.current.profiles[0]).toEqual(mockProfile);
    expect(result.current.profiles[1]).toEqual(profile2);
  });

  it('maintains separate chats for different profiles', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.ensureChatFor('1');
      result.current.ensureChatFor('2');
      result.current.addUserMessage('1', 'Message to profile 1');
      result.current.addUserMessage('2', 'Message to profile 2');
    });

    expect(result.current.chats['1']).toHaveLength(5); // 4 bot + 1 user
    expect(result.current.chats['2']).toHaveLength(5); // 4 bot + 1 user
    expect(result.current.chats['1'][4].text).toBe('Message to profile 1');
    expect(result.current.chats['2'][4].text).toBe('Message to profile 2');
  });
});
