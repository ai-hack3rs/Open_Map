// Free, no-API-key vector tile style from CARTO (OpenStreetMap data)
export const CARTO_DARK_STYLE_URL =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const APP_THEME = {
  colors: {
    glassBackground: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    primaryAccent: '#5e5ce6',
    surface: '#1c1c1e',
  },
  shadows: {
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.35,
      shadowRadius: 35,
      elevation: 24, // Android massive drop shadow
    },
  },
  physics: {
    bobAmplitude: 6,
    bobDuration: 2500,
  },
};
