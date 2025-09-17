import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppStore, type Profile } from '../store';
import './MatchesPage.css';

/**
 * Formats a timestamp into a relative time string
 * @param timestamp - The timestamp to format
 * @returns A human-readable relative time string
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;

  // For older messages, show the actual date
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gets a human-readable label for message status
 * @param status - The message status
 * @returns A human-readable status label
 */
function getStatusLabel(
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
): string {
  switch (status) {
    case 'sending':
      return 'Envoi en cours';
    case 'sent':
      return 'Envoyé';
    case 'delivered':
      return 'Livré';
    case 'read':
      return 'Lu';
    case 'failed':
      return "Échec de l'envoi";
    default:
      return 'Inconnu';
  }
}

/**
 * Common emojis for the emoji picker
 */
const EMOJI_CATEGORIES = {
  Faces: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😔',
    '😕',
    '🙁',
    '☹️',
    '😣',
    '😖',
    '😫',
    '😩',
    '🥺',
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤬',
    '🤯',
    '😳',
    '🥵',
    '🥶',
    '😱',
    '😨',
    '😰',
    '😥',
    '😓',
    '🤗',
    '🤔',
    '🤭',
    '🤫',
    '🤥',
    '😶',
    '😐',
    '😑',
    '😬',
    '🙄',
    '😯',
    '😦',
    '😧',
    '😮',
    '😲',
    '🥱',
    '😴',
    '🤤',
    '😪',
    '😵',
    '🤐',
    '🥴',
    '🤢',
    '🤮',
    '🤧',
    '😷',
    '🤒',
    '🤕',
    '🤑',
    '🤠',
    '😈',
    '👿',
    '👹',
    '👺',
    '🤡',
    '💩',
    '👻',
    '💀',
    '☠️',
    '👽',
    '👾',
    '🤖',
    '🎃',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
  ],
  Gestes: [
    '👋',
    '🤚',
    '🖐️',
    '✋',
    '🖖',
    '👌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝️',
    '👍',
    '👎',
    '👊',
    '✊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💅',
    '🤳',
    '💪',
    '🦾',
    '🦿',
    '🦵',
    '🦶',
    '👂',
    '🦻',
    '👃',
    '🧠',
    '🦷',
    '🦴',
    '👀',
    '👁️',
    '👅',
    '👄',
    '💋',
    '🩸',
  ],
  Objets: [
    '💎',
    '🔔',
    '🔕',
    '📢',
    '📣',
    '📯',
    '🎺',
    '🎷',
    '🥁',
    '🎸',
    '🎹',
    '🎵',
    '🎶',
    '📻',
    '🎙️',
    '🎚️',
    '🎛️',
    '📺',
    '📷',
    '📸',
    '📹',
    '🎥',
    '💽',
    '💾',
    '💿',
    '📀',
    '📱',
    '☎️',
    '📞',
    '📟',
    '📠',
    '🔌',
    '🔋',
    '🔍',
    '🔎',
    '🕯️',
    '💡',
    '🔦',
    '🏮',
    '🪔',
    '📔',
    '📕',
    '📖',
    '📗',
    '📘',
    '📙',
    '📚',
    '📓',
    '📒',
    '📃',
    '📜',
    '📄',
    '📰',
    '🗞️',
    '📑',
    '🔖',
    '🏷️',
    '💰',
    '💴',
    '💵',
    '💶',
    '💷',
    '💸',
    '💳',
    '💹',
    '💱',
    '💲',
    '✉️',
    '📧',
    '📨',
    '📩',
    '📤',
    '📥',
    '📦',
    '📫',
    '📪',
    '📬',
    '📭',
    '📮',
    '🗳️',
    '✏️',
    '✒️',
    '🖋️',
    '🖊️',
    '🖌️',
    '🖍️',
    '📝',
    '✂️',
    '🗃️',
    '🗄️',
    '🗑️',
    '🔒',
    '🔓',
    '🔏',
    '🔐',
    '🔑',
    '🗝️',
    '🔨',
    '🪓',
    '⛏️',
    '⚒️',
    '🛠️',
    '🗡️',
    '⚔️',
    '🔫',
    '🏹',
    '🛡️',
    '🔧',
    '🔩',
    '⚙️',
    '🗜️',
    '⚖️',
    '🦯',
    '🔗',
    '⛓️',
    '🧰',
    '🧲',
    '⚗️',
    '🧪',
    '🧫',
    '🧬',
    '🔬',
    '🔭',
    '📡',
    '💉',
    '💊',
    '🩹',
    '🩺',
    '🚪',
    '🛏️',
    '🛋️',
    '🚽',
    '🚿',
    '🛁',
    '🛀',
    '🧴',
    '🧷',
    '🧹',
    '🧺',
    '🧻',
    '🚰',
    '🧼',
    '🧽',
    '🧯',
    '🛒',
  ],
  Nourriture: [
    '🍎',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🫐',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
    '🍆',
    '🥑',
    '🥦',
    '🥬',
    '🥒',
    '🌶️',
    '🫑',
    '🌽',
    '🥕',
    '🫒',
    '🧄',
    '🧅',
    '🥔',
    '🍠',
    '🥐',
    '🥖',
    '🍞',
    '🥨',
    '🥯',
    '🧀',
    '🥚',
    '🍳',
    '🧈',
    '🥞',
    '🧇',
    '🥓',
    '🥩',
    '🍗',
    '🍖',
    '🦴',
    '🌭',
    '🍔',
    '🍟',
    '🍕',
    '🫓',
    '🥙',
    '🌮',
    '🌯',
    '🫔',
    '🥗',
    '🥘',
    '🫕',
    '🥫',
    '🍝',
    '🍜',
    '🍲',
    '🍛',
    '🍣',
    '🍱',
    '🥟',
    '🦪',
    '🍤',
    '🍙',
    '🍚',
    '🍘',
    '🍥',
    '🥠',
    '🥮',
    '🍢',
    '🍡',
    '🍧',
    '🍨',
    '🍦',
    '🥧',
    '🧁',
    '🍰',
    '🎂',
    '🍮',
    '🍭',
    '🍬',
    '🍫',
    '🍿',
    '🍩',
    '🍪',
    '🌰',
    '🥜',
    '🍯',
  ],
  Activités: [
    '⚽',
    '🏀',
    '🏈',
    '⚾',
    '🥎',
    '🎾',
    '🏐',
    '🏉',
    '🎱',
    '🪀',
    '🏓',
    '🏸',
    '🏒',
    '🏑',
    '🥍',
    '🏏',
    '🪃',
    '🥅',
    '⛳',
    '🪁',
    '🏹',
    '🎣',
    '🤿',
    '🥊',
    '🥋',
    '🎽',
    '🛹',
    '🛷',
    '⛸️',
    '🥌',
    '🎿',
    '⛷️',
    '🏂',
    '🪂',
    '🏋️‍♀️',
    '🏋️',
    '🏋️‍♂️',
    '🤼‍♀️',
    '🤼',
    '🤼‍♂️',
    '🤸‍♀️',
    '🤸',
    '🤸‍♂️',
    '⛹️‍♀️',
    '⛹️',
    '⛹️‍♂️',
    '🤺',
    '🤾‍♀️',
    '🤾',
    '🤾‍♂️',
    '🏌️‍♀️',
    '🏌️',
    '🏌️‍♂️',
    '🏇',
    '🧘‍♀️',
    '🧘',
    '🧘‍♂️',
    '🏄‍♀️',
    '🏄',
    '🏄‍♂️',
    '🏊‍♀️',
    '🏊',
    '🏊‍♂️',
    '🤽‍♀️',
    '🤽',
    '🤽‍♂️',
    '🚣‍♀️',
    '🚣',
    '🚣‍♂️',
    '🧗‍♀️',
    '🧗',
    '🧗‍♂️',
    '🚵‍♀️',
    '🚵',
    '🚵‍♂️',
    '🚴‍♀️',
    '🚴',
    '🚴‍♂️',
    '🏆',
    '🥇',
    '🥈',
    '🥉',
    '🏅',
    '🎖️',
    '🏵️',
    '🎗️',
    '🎫',
    '🎟️',
    '🎪',
    '🤹',
    '🤹‍♀️',
    '🤹‍♂️',
    '🎭',
    '🩰',
    '🎨',
    '🎬',
    '🎤',
    '🎧',
    '🎼',
    '🎵',
    '🎶',
    '🪘',
    '🥁',
    '🎹',
    '🎷',
    '🎺',
    '🎸',
    '🪕',
    '🎻',
    '🎲',
    '♠️',
    '♥️',
    '♦️',
    '♣️',
    '♟️',
    '🃏',
    '🀄',
    '🎴',
    '🎯',
    '🎳',
    '🎮',
    '🕹️',
    '🎰',
    '🧩',
  ],
};

/**
 * Inserts an emoji into the text input
 */
function insertEmoji(
  text: string,
  emoji: string,
  cursorPosition: number
): { newText: string; newCursorPosition: number } {
  const beforeCursor = text.slice(0, cursorPosition);
  const afterCursor = text.slice(cursorPosition);
  const newText = beforeCursor + emoji + afterCursor;
  const newCursorPosition = cursorPosition + emoji.length;
  return { newText, newCursorPosition };
}

/**
 * Matches page component that displays liked profiles and chat interface.
 * Shows a dropdown for match selection and chat window below.
 *
 * @returns JSX element representing the matches page
 */
export default function MatchesPage() {
  const { likedIds, profiles } = useAppStore();
  const liked = profiles.filter(p => likedIds.has(p.id));
  // Only show other people's profiles that were liked, not the current user
  const allMatches = liked;
  const [activeId, setActiveId] = useState<string | null>(
    allMatches[0]?.id ?? null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter matches based on search query
  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return allMatches;
    return allMatches.filter(
      match =>
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.strikeFund.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMatches, searchQuery]);

  // Find activeProfile from allMatches, not filteredMatches, to ensure consistency
  const activeProfile = allMatches.find(p => p.id === activeId);

  // Debug logging (can be removed in production)
  // console.log('Debug - activeId:', activeId);
  // console.log('Debug - filteredMatches:', filteredMatches.map(p => p.id));
  // console.log('Debug - activeProfile:', activeProfile?.name);

  // Handle case where allMatches changes and we need to set a default activeId
  useEffect(() => {
    if (allMatches.length > 0 && !activeId) {
      setActiveId(allMatches[0].id);
    }
  }, [allMatches, activeId]);

  // Track activeId changes (debug only)
  // useEffect(() => {
  //   console.log('activeId changed to:', activeId);
  // }, [activeId]);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Keyboard navigation for match selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredMatches.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % filteredMatches.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev =>
            prev === 0 ? filteredMatches.length - 1 : prev - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredMatches[focusedIndex]) {
            setActiveId(filteredMatches[focusedIndex].id);
            setIsDropdownOpen(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsDropdownOpen(false);
          break;
      }
    };

    if (isDropdownOpen || !isMobile) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDropdownOpen, isMobile, filteredMatches, focusedIndex]);

  // Update focusedIndex when activeId changes (to keep them in sync)
  useEffect(() => {
    if (activeId) {
      const newFocusedIndex = filteredMatches.findIndex(p => p.id === activeId);
      if (newFocusedIndex !== -1) {
        setFocusedIndex(prevIndex => {
          if (prevIndex !== newFocusedIndex) {
            return newFocusedIndex;
          }
          return prevIndex;
        });
      }
    }
  }, [activeId, filteredMatches]);

  // Focus management when switching matches
  useEffect(() => {
    if (activeId) {
      // Focus the chat input when switching to a new match
      const input = document.querySelector(
        '.message-input'
      ) as HTMLInputElement;
      if (input) {
        // Small delay to ensure the chat window is rendered
        setTimeout(() => {
          input.focus();
        }, 100);
      }
    }
  }, [activeId]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector(
          '.search-input, .mobile-search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close dropdown
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isDropdownOpen]);

  return (
    <div className="matches-layout-new">
      {/* Match Selection - Mobile Dropdown or Desktop List */}
      <div className="match-selector">
        {isMobile ? (
          // Mobile: Dropdown Button
          <>
            <button
              className="match-selector-button"
              aria-label="Sélectionner une correspondance"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => {
                console.log('Dropdown clicked, current state:', isDropdownOpen);
                setIsDropdownOpen(!isDropdownOpen);

                // Focus search input when dropdown opens
                if (!isDropdownOpen) {
                  setTimeout(() => {
                    const searchInput = document.querySelector(
                      '.mobile-search-input'
                    ) as HTMLInputElement;
                    if (searchInput) {
                      searchInput.focus();
                    }
                  }, 100);
                }
              }}
            >
              <div className="match-selector-content">
                {activeProfile ? (
                  <>
                    <img
                      src={activeProfile.photoUrl}
                      alt={activeProfile.name}
                      className="match-selector-avatar"
                    />
                    <div className="match-selector-info">
                      <span className="match-selector-name">
                        {activeProfile.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="match-selector-placeholder">
                    <span>Sélectionner une correspondance</span>
                  </div>
                )}
              </div>
              <svg
                className={`match-selector-arrow ${isDropdownOpen ? 'open' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Mobile Full Screen Dropdown Overlay */}
            {isDropdownOpen && (
              <div
                className="match-dropdown-overlay"
                onClick={() => {
                  console.log('Overlay clicked, closing dropdown');
                  setIsDropdownOpen(false);
                }}
              >
                <div
                  className="match-dropdown-content"
                  onClick={e => {
                    console.log('Content clicked, preventing close');
                    e.stopPropagation();
                  }}
                >
                  <div className="match-dropdown-header">
                    <h2>Vos correspondances</h2>
                    <button
                      className="match-dropdown-close"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mobile-search-container">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="mobile-search-input"
                      aria-label="Rechercher dans les correspondances"
                    />
                    {searchQuery && (
                      <button
                        className="mobile-clear-search"
                        onClick={() => setSearchQuery('')}
                        aria-label="Effacer la recherche"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div
                    className="match-dropdown-list"
                    role="listbox"
                    aria-label="Liste des correspondances"
                  >
                    {filteredMatches.length === 0 ? (
                      <div className="no-matches-message">
                        <div className="no-matches-icon">💔</div>
                        <h3>
                          {allMatches.length === 0
                            ? 'Aucune correspondance trouvée'
                            : 'Aucun résultat pour cette recherche'}
                        </h3>
                        <p>
                          {allMatches.length === 0
                            ? 'Commencez à liker des profils sur la page Découvrir pour créer des correspondances'
                            : "Essayez avec d'autres mots-clés"}
                        </p>
                        {allMatches.length === 0 && (
                          <a href="/" className="cta-button">
                            Découvrir des profils
                          </a>
                        )}
                      </div>
                    ) : (
                      filteredMatches.map(p => (
                        <div
                          key={p.id}
                          className={`match-dropdown-item ${activeId === p.id ? 'active' : ''} ${focusedIndex === filteredMatches.indexOf(p) ? 'focused' : ''}`}
                          role="option"
                          aria-selected={activeId === p.id}
                          aria-label={`Correspondance avec ${p.name}`}
                          tabIndex={-1}
                          onClick={() => {
                            setActiveId(p.id);
                            setIsDropdownOpen(false);

                            // Focus chat input after selection
                            setTimeout(() => {
                              const input = document.querySelector(
                                '.message-input'
                              ) as HTMLInputElement;
                              if (input) {
                                input.focus();
                              }
                            }, 200);
                          }}
                        >
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="match-dropdown-avatar"
                          />
                          <div className="match-dropdown-info">
                            <span className="match-dropdown-name">
                              {p.name}
                            </span>
                          </div>
                          {activeId === p.id && (
                            <div className="match-dropdown-check">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Desktop: Direct List
          <div className="desktop-matches-list">
            <h3 className="desktop-matches-title">Vos correspondances</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher une correspondance..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Rechercher dans les correspondances"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div
              className="desktop-matches-container"
              role="listbox"
              aria-label="Liste des correspondances"
            >
              {filteredMatches.length === 0 ? (
                <div className="no-matches-message">
                  <div className="no-matches-icon">💔</div>
                  <h3>
                    {allMatches.length === 0
                      ? 'Aucune correspondance trouvée'
                      : 'Aucun résultat pour cette recherche'}
                  </h3>
                  <p>
                    {allMatches.length === 0
                      ? 'Commencez à liker des profils sur la page Découvrir pour créer des correspondances'
                      : "Essayez avec d'autres mots-clés"}
                  </p>
                  {allMatches.length === 0 && (
                    <a href="/" className="cta-button">
                      Découvrir des profils
                    </a>
                  )}
                </div>
              ) : (
                filteredMatches.map(p => (
                  <div
                    key={p.id}
                    className={`desktop-match-item ${activeId === p.id ? 'active' : ''} ${focusedIndex === filteredMatches.indexOf(p) ? 'focused' : ''}`}
                    role="option"
                    aria-selected={activeId === p.id}
                    aria-label={`Correspondance avec ${p.name}`}
                    tabIndex={0}
                    onClick={() => {
                      setActiveId(p.id);

                      // Focus chat input after selection
                      setTimeout(() => {
                        const input = document.querySelector(
                          '.message-input'
                        ) as HTMLInputElement;
                        if (input) {
                          input.focus();
                        }
                      }, 100);
                    }}
                  >
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="desktop-match-avatar"
                    />
                    <div className="desktop-match-info">
                      <span className="desktop-match-name">{p.name}</span>
                    </div>
                    {activeId === p.id && (
                      <div className="desktop-match-check">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        {activeId ? (
          <ChatWindow key={activeId} matchId={activeId} />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

/**
 * Empty chat state when no match is selected
 */
function EmptyChatState() {
  return (
    <div className="empty-chat-state">
      <div className="empty-chat-icon">💬</div>
      <h3>Sélectionnez une correspondance</h3>
      <p>
        Choisissez une correspondance dans le menu déroulant pour commencer à
        discuter
      </p>
    </div>
  );
}

/**
 * Chat window component for messaging with a matched profile
 * @param props - Component props
 * @param props.matchId - ID of the matched profile to chat with
 * @returns JSX element representing the chat interface
 */
function ChatWindow({ matchId }: { matchId: string }) {
  const {
    profiles,
    chats,
    ensureChatFor,
    addUserMessage,
    addBotMessage,
    updateMessageStatus,
  } = useAppStore();
  const profile = profiles.find(p => p.id === matchId)!;
  const messages = useMemo(() => {
    return chats[matchId] ?? [];
  }, [chats, matchId]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [, setTimestampUpdate] = useState(0); // Force re-render for timestamps
  const [, setFailedMessages] = useState<Set<number>>(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>('Faces');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Ensure chat exists for this match
  useEffect(() => {
    if (!chats[matchId]) {
      ensureChatFor(matchId);
    }
  }, [matchId, ensureChatFor]);

  // Reset internal state when matchId changes
  useEffect(() => {
    setText('');
    setIsTyping(false);
    setShowInput(true);
    setShowEmojiPicker(false);
    setSelectedEmojiCategory('Faces');
  }, [matchId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [matchId]);

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampUpdate(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle scroll events for smart input visibility
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const currentScrollTop = chatContainer.scrollTop;
      const scrollHeight = chatContainer.scrollHeight;
      const clientHeight = chatContainer.clientHeight;
      const isAtBottom = currentScrollTop + clientHeight >= scrollHeight - 10;

      // Determine scroll direction
      const direction =
        currentScrollTop > lastScrollTop.current ? 'down' : 'up';
      lastScrollTop.current = currentScrollTop;

      console.log('Scroll:', {
        currentScrollTop,
        direction,
        isAtBottom,
        showInput: showInput,
      });

      // Always show input when at the very top
      if (currentScrollTop <= 10) {
        setShowInput(true);
      }
      // Always show input when at bottom
      else if (isAtBottom) {
        setShowInput(true);
      }
      // Show input when scrolling down
      else if (direction === 'down') {
        setShowInput(true);
      }
      // Hide input when scrolling up and not at top/bottom
      else if (direction === 'up' && currentScrollTop > 50 && !isAtBottom) {
        setShowInput(false);
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, [showInput]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  /**
   * Scrolls to the bottom of the messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Sends a message to the chat
   */
  const send = () => {
    if (!text.trim()) return;

    const userMessage = text.trim();

    // Get the current message count before adding the new message
    const currentMessages = chats[matchId] ?? [];
    const messageIndex = currentMessages.length;

    addUserMessage(matchId, userMessage);
    setText('');

    // Simulate message sending with potential failure
    const shouldFail = Math.random() < 0.1; // 10% chance of failure for demo

    setTimeout(() => {
      if (shouldFail) {
        updateMessageStatus(matchId, messageIndex, 'failed');
        setFailedMessages(prev => new Set([...prev, messageIndex]));
      } else {
        updateMessageStatus(matchId, messageIndex, 'sent');
      }
    }, 500);

    if (!shouldFail) {
      setTimeout(() => {
        updateMessageStatus(matchId, messageIndex, 'delivered');
      }, 1000);

      // Simulate bot response after a delay
      setIsTyping(true);
      setTimeout(
        () => {
          const botResponse = generateBotResponse(userMessage, profile);
          addBotMessage(matchId, botResponse);
          setIsTyping(false);

          // Mark user message as read when bot responds
          updateMessageStatus(matchId, messageIndex, 'read');
        },
        1000 + Math.random() * 2000
      ); // 1-3 second delay
    }

    // Keep focus on input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  /**
   * Retries sending a failed message
   */
  const retryMessage = (messageIndex: number) => {
    setFailedMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageIndex);
      return newSet;
    });

    // Simulate retry
    setTimeout(() => {
      updateMessageStatus(matchId, messageIndex, 'sent');
    }, 500);

    setTimeout(() => {
      updateMessageStatus(matchId, messageIndex, 'delivered');
    }, 1000);
  };

  /**
   * Handles emoji selection
   */
  const handleEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      const { newText, newCursorPosition } = insertEmoji(
        text,
        emoji,
        cursorPosition
      );
      setText(newText);

      // Set cursor position after emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
          inputRef.current.focus();
        }
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  /**
   * Generates a simple bot response
   */
  const generateBotResponse = (
    userMessage: string,
    profile: Profile
  ): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('salut') || lowerMessage.includes('bonjour')) {
      return `Salut ! Merci de t'intéresser à notre cause ! 😊`;
    }

    if (lowerMessage.includes('cause') || lowerMessage.includes('grève')) {
      return `Notre grève pour ${profile.strikeFund.title} est cruciale ! Chaque soutien compte ✊`;
    }

    if (lowerMessage.includes('soutenir') || lowerMessage.includes('aider')) {
      return `C'est génial ! Tu peux nous aider ici : ${profile.strikeFund.url} 💪`;
    }

    if (lowerMessage.includes('comment') && lowerMessage.includes('va')) {
      return `Ça va bien, merci ! Je suis motivé(e) pour notre lutte ! 💪`;
    }

    const responses = [
      `Merci pour ton message ! Notre cause ${profile.strikeFund.title} est vraiment importante 😊`,
      `C'est super de discuter avec toi ! Tu peux nous soutenir via le lien dans mon profil ✊`,
      `Je suis content(e) que tu t'intéresses à notre lutte ! 💪`,
      `Notre grève est nécessaire pour défendre nos droits ! 🔥`,
      `Chaque message de soutien nous donne de la force ! 💪`,
      `Merci de prendre le temps de discuter avec moi ! 😊`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  /**
   * Renders message text with clickable links
   * @param text - Message text that may contain URLs
   * @returns JSX element with clickable links
   */
  const renderMessageText = (text: string) => {
    // Simple URL detection regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="link-blue"
            style={{ wordBreak: 'break-all' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="chat-window-new">
      {/* Chat Header */}
      <div className="chat-header-new">
        <div className="chat-profile-info">
          <div className="chat-avatar">
            <img
              src={profile.photoUrl}
              alt={`Photo de profil de ${profile.name}`}
            />
          </div>
          <div className="chat-profile-details">
            <h3 className="chat-name">{profile.name}</h3>
            <p className="chat-status">En ligne</p>
          </div>
        </div>
        <div className="chat-actions">
          <a
            href={profile.strikeFund.url}
            target="_blank"
            rel="noreferrer"
            className="strike-fund-btn"
            aria-label={`Soutenir la cause ${profile.strikeFund.title}`}
          >
            <span>Soutenir</span>
            <span className="fund-title">{profile.strikeFund.title}</span>
          </a>
        </div>
      </div>

      {/* Screen Reader Instructions */}
      <div id="chat-instructions" className="sr-only">
        Conversation avec {profile.name}. Utilisez les flèches pour naviguer
        dans les messages. Appuyez sur Entrée pour envoyer un message. Les
        réponses automatiques sont indiquées par un indicateur de bot.
      </div>

      {/* Scrollable Chat Messages */}
      <div
        className="chat-messages-new"
        ref={chatContainerRef}
        role="log"
        aria-label="Messages de conversation"
        aria-live="polite"
        aria-describedby="chat-instructions"
      >
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h3>Commencez la conversation !</h3>
            <p>
              Envoyez un message pour commencer à discuter avec {profile.name}
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.from === 'user' ? 'message--user' : 'message--bot'}`}
              role="article"
              aria-label={`Message ${m.from === 'user' ? 'de vous' : `de ${profile.name}`}`}
            >
              {m.from === 'bot' && (
                <div className="message-avatar">
                  <img src={profile.photoUrl} alt={profile.name} />
                  <div
                    className="bot-indicator"
                    title="Réponse automatique"
                    aria-label="Réponse automatique"
                  >
                    🤖
                  </div>
                </div>
              )}
              <div className="message-content">
                <div
                  className={`message-bubble ${m.from === 'user' ? 'message-bubble--user' : 'message-bubble--bot'}`}
                >
                  <div className="message-text">
                    {renderMessageText(m.text)}
                  </div>
                  <div className="message-time-container">
                    <div
                      className="message-time"
                      title={new Date(m.ts).toLocaleString('fr-FR')}
                    >
                      {formatRelativeTime(m.ts)}
                    </div>
                    {m.from === 'user' && m.status && (
                      <div
                        className="message-status"
                        aria-label={`Statut du message: ${getStatusLabel(m.status)}`}
                      >
                        {m.status === 'sending' && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-label="Envoi en cours"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              opacity="0.3"
                            />
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                              fill="currentColor"
                              opacity="0.3"
                            />
                          </svg>
                        )}
                        {m.status === 'sent' && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-label="Message envoyé"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {m.status === 'delivered' && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-label="Message livré"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              transform="translate(0, 4)"
                            />
                          </svg>
                        )}
                        {m.status === 'read' && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-label="Message lu"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              transform="translate(0, 4)"
                            />
                            <circle cx="18" cy="6" r="2" fill="currentColor" />
                          </svg>
                        )}
                        {m.status === 'failed' && (
                          <button
                            className="retry-button"
                            onClick={() => retryMessage(i)}
                            title="Réessayer d'envoyer le message"
                            aria-label="Réessayer d'envoyer le message"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-label="Réessayer"
                            >
                              <path
                                d="M1 4v6h6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M23 20v-6h-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="message message--bot">
            <div className="message-avatar">
              <img src={profile.photoUrl} alt={profile.name} />
              <div
                className="bot-indicator"
                title="Réponse automatique"
                aria-label="Bot"
              ></div>
            </div>
            <div className="message-content">
              <div className="message-bubble message-bubble--bot">
                <div
                  className="typing-indicator"
                  aria-label="En train d'écrire"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live region for screen readers */}
        <div
          id="message-status-announcements"
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        ></div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Chat Input - At the bottom, above nav bar */}
      <div className={`chat-input-new ${showInput ? 'visible' : 'hidden'}`}>
        <div className="input-container">
          <button
            className="emoji-button"
            onClick={() => {
              console.log(
                'Emoji button clicked, current state:',
                showEmojiPicker
              );
              setShowEmojiPicker(!showEmojiPicker);
            }}
            aria-label="Ouvrir le sélecteur d'emojis"
            type="button"
            disabled={isTyping}
          >
            😊
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Tapez un message à ${profile.name}...`}
            className="message-input"
            aria-label={`Tapez un message à ${profile.name}`}
            aria-describedby="input-hint"
            maxLength={500}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              } else if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={isTyping}
          />
          <button
            onClick={send}
            className="send-btn"
            disabled={!text.trim() || isTyping}
            title="Envoyer le message"
          >
            {isTyping ? (
              <div className="loading-spinner">
                <div></div>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            className="emoji-picker"
            ref={emojiPickerRef}
            style={{ display: 'flex' }}
          >
            <div className="emoji-categories">
              {Object.keys(EMOJI_CATEGORIES).map(category => (
                <button
                  key={category}
                  className={`emoji-category ${selectedEmojiCategory === category ? 'active' : ''}`}
                  onClick={() =>
                    setSelectedEmojiCategory(
                      category as keyof typeof EMOJI_CATEGORIES
                    )
                  }
                  aria-label={`Catégorie ${category}`}
                >
                  {category === 'Faces' && '😀'}
                  {category === 'Gestes' && '👋'}
                  {category === 'Objets' && '💎'}
                  {category === 'Nourriture' && '🍎'}
                  {category === 'Activités' && '⚽'}
                </button>
              ))}
            </div>
            <div className="emoji-grid">
              {EMOJI_CATEGORIES[selectedEmojiCategory].map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-item"
                  onClick={() => handleEmojiSelect(emoji)}
                  aria-label={`Emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="input-hint" id="input-hint">
          <span>
            Entrée ou Ctrl+Entrée pour envoyer • Shift+Entrée pour une nouvelle
            ligne
          </span>
          <span
            className={`character-count ${text.length > 400 ? 'danger' : text.length > 300 ? 'warning' : ''}`}
          >
            {text.length}/500
          </span>
        </div>
      </div>

      {/* Input Hint when hidden */}
      {!showInput && (
        <div className="input-hint-floating" onClick={() => setShowInput(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19L12 5M5 12L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Faire défiler vers le haut pour écrire</span>
        </div>
      )}
    </div>
  );
}
