import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/axiosInstance';

/**
 * Global Keyboard Shortcuts Hook
 * Provides productivity shortcuts throughout the application
 */
const useKeyboardShortcuts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = isAuthenticated();
    const isAdminArea = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                return;
            }

            // Alt + number shortcuts (only when logged in)
            if (e.altKey && isLoggedIn) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        navigate('/admin');
                        break;
                    case '2':
                        e.preventDefault();
                        navigate('/admin/students');
                        break;
                    case '3':
                        e.preventDefault();
                        navigate('/admin/results');
                        break;
                    case '4':
                        e.preventDefault();
                        navigate('/admin/entry');
                        break;
                    case '5':
                        e.preventDefault();
                        navigate('/admin/reports');
                        break;
                    case 'h':
                    case 'H':
                        e.preventDefault();
                        navigate('/');
                        break;
                    default:
                        break;
                }
            }

            // G then another key shortcuts (vim style)
            // This is handled by the CommandPalette for simplicity
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, isLoggedIn]);
};

/**
 * KeyboardShortcuts Component
 * Renders nothing - just hooks into the keyboard events
 */
const KeyboardShortcuts = () => {
    useKeyboardShortcuts();
    return null;
};

export default KeyboardShortcuts;
export { useKeyboardShortcuts };
