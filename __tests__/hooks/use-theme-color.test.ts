import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

jest.mock('@/hooks/use-color-scheme');

describe('useThemeColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns color from props when provided for light theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { result } = renderHook(() =>
      useThemeColor({ light: '#123456', dark: '#654321' }, 'text')
    );
    expect(result.current).toBe('#123456');
  });

  it('returns color from props when provided for dark theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { result } = renderHook(() =>
      useThemeColor({ light: '#123456', dark: '#654321' }, 'text')
    );
    expect(result.current).toBe('#654321');
  });

  it('returns color from theme constants when not provided in props (light)', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    expect(result.current).toBe(Colors.light.text);
  });

  it('returns color from theme constants when not provided in props (dark)', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { result } = renderHook(() => useThemeColor({}, 'background'));
    expect(result.current).toBe(Colors.dark.background);
  });

  it('defaults to light theme when useColorScheme returns null or undefined', () => {
    (useColorScheme as jest.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() => useThemeColor({}, 'tint'));
    expect(result.current).toBe(Colors.light.tint);
  });
});
