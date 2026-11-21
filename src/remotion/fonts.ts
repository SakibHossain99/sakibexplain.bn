import { loadFont as loadHindSiliguri } from '@remotion/google-fonts/HindSiliguri';
import { loadFont as loadPlayfairDisplay } from '@remotion/google-fonts/PlayfairDisplay';

const hindSiliguri = loadHindSiliguri('normal', {
  weights: ['500', '600', '700'],
  subsets: ['bengali', 'latin'],
});

const playfairDisplay = loadPlayfairDisplay('italic', {
  weights: ['600'],
  subsets: ['latin'],
});

export const BENGALI_FONT = `${hindSiliguri.fontFamily}, "Noto Sans Bengali", sans-serif`;
export const SERIF_FONT = `${playfairDisplay.fontFamily}, Georgia, serif`;
