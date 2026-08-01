import type { AudioTrack } from './types';
import bom from '@/assets/artwork/bomskor.webp';
import mhhsskor from '@/assets/artwork/mhhsskor.webp';
import presenttoyou from '@/assets/bgmusic/presenttoyou.mp3';
import returnbom from '@/assets/bgmusic/return.mp3';
import ghost from '@/assets/bgmusic/ghost.wav'

// SYNC: mirror dari TRACKS di AudioWorks.tsx — edit dua-duanya kalau berubah.
// (AudioWorks.tsx sengaja gak dirombak biar yang udah jalan tetap aman.)
export const audioTracks: AudioTrack[] = [
    { id: 1, title: 'Present to you', film: 'My Hand, Her Signature', year: '2026', role: 'Composer', audio: presenttoyou, artwork: mhhsskor, accent: '#14b8a6' },
    { id: 2, title: 'Bounce of Memories — Score', film: 'Bounce of Memories', year: '2025', role: 'Composer', audio: returnbom, artwork: bom, accent: '#3b82f6' },
    { id: 3, title: 'Laberinto de Illusione — Theme', film: 'Laberinto de Illusione', year: '2024', role: 'Composer & Sound Design', audio: ghost, artwork: mhhsskor, accent: '#ec4899' },
];