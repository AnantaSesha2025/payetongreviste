import { useState, useCallback } from 'react';

interface UndoAction {
  id: string;
  type: 'like' | 'pass';
  profileId: string;
  timestamp: number;
}

interface UndoState {
  actions: UndoAction[];
  currentIndex: number;
  maxHistory: number;
}

/**
 * Hook for managing undo functionality in swipe interfaces
 */
export function useUndo(maxHistory: number = 10) {
  const [state, setState] = useState<UndoState>({
    actions: [],
    currentIndex: -1,
    maxHistory,
  });

  const addAction = useCallback(
    (action: Omit<UndoAction, 'id' | 'timestamp'>) => {
      const newAction: UndoAction = {
        ...action,
        id: `undo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setState(prev => {
        const newActions = [
          ...prev.actions.slice(0, prev.currentIndex + 1),
          newAction,
        ];

        // Limit history size
        if (newActions.length > maxHistory) {
          newActions.shift();
        }

        return {
          ...prev,
          actions: newActions,
          currentIndex: Math.min(newActions.length - 1, maxHistory - 1),
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= 0) {
        return {
          ...prev,
          currentIndex: prev.currentIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex < prev.actions.length - 1) {
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
        };
      }
      return prev;
    });
  }, []);

  const canUndo = state.currentIndex >= 0;
  const canRedo = state.currentIndex < state.actions.length - 1;

  const getCurrentAction = useCallback(() => {
    if (state.currentIndex >= 0 && state.currentIndex < state.actions.length) {
      return state.actions[state.currentIndex];
    }
    return null;
  }, [state.actions, state.currentIndex]);

  const getLastAction = useCallback(() => {
    if (state.actions.length > 0) {
      return state.actions[state.actions.length - 1];
    }
    return null;
  }, [state.actions]);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      actions: [],
      currentIndex: -1,
    }));
  }, []);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentAction,
    getLastAction,
    clearHistory,
    historyLength: state.actions.length,
    currentIndex: state.currentIndex,
  };
}

/**
 * Hook for managing swipe history with undo functionality
 */
export function useSwipeHistory() {
  const undo = useUndo(20); // Keep more history for swipes
  const [lastSwipe, setLastSwipe] = useState<UndoAction | null>(null);

  const recordSwipe = useCallback(
    (type: 'like' | 'pass', profileId: string) => {
      const action = { type, profileId };
      undo.addAction(action);
      setLastSwipe({
        ...action,
        id: `swipe_${Date.now()}`,
        timestamp: Date.now(),
      });
    },
    [undo]
  );

  const undoLastSwipe = useCallback(() => {
    if (undo.canUndo) {
      undo.undo();
      const currentAction = undo.getCurrentAction();
      setLastSwipe(currentAction);
    }
  }, [undo]);

  const getUndoableAction = useCallback(() => {
    return undo.getLastAction();
  }, [undo]);

  return {
    recordSwipe,
    undoLastSwipe,
    canUndo: undo.canUndo,
    lastSwipe,
    getUndoableAction,
    clearHistory: undo.clearHistory,
  };
}
