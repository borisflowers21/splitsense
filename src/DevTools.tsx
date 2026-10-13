import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Entrance, MotionPressable } from './Motion';

export const previewPages = ['welcome', 'login', 'create', 'Home', 'Train', 'Progress', 'Profile', 'Workout'] as const;
export type PreviewPage = typeof previewPages[number];
export type AppPage = Exclude<PreviewPage, 'welcome' | 'login' | 'create'>;
const titles: Record<PreviewPage, string> = { welcome: 'Welcome', login: 'Log In', create: 'Create Account', Home: 'Home', Train: 'Training Log', Progress: 'Progress', Profile: 'Profile', Workout: 'Log a Workout' };

export default function DevTools({ page, onNavigate }: { page: PreviewPage; onNavigate: (page: PreviewPage) => void }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  if (!__DEV__) return null;
  const index = previewPages.indexOf(page);
  function go(next: PreviewPage) { setOpen(false); onNavigate(next); }
  return <>
    <View pointerEvents="box-none" style={[styles.dock, { bottom: insets.bottom + (index > 2 ? 80 : 14) }]}>
      <View style={styles.toolbar}><MotionPressable accessibilityRole="button" accessibilityLabel="Open developer tools" onPress={() => setOpen(true)} style={styles.devButton}><Ionicons name="code-slash" size={16} color="#D7F28C" /><Text style={styles.devText}>DEV</Text></MotionPressable><View style={styles.separator} /><MotionPressable accessibilityRole="button" accessibilityLabel="Skip to next page" onPress={() => go(previewPages[(index + 1) % previewPages.length])} style={styles.nextButton}><Text style={styles.nextText}>Next page</Text><Ionicons name="arrow-forward" size={17} color="white" /></MotionPressable></View>
    </View>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}><View style={styles.overlay}><Entrance style={styles.panel}><ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}><View style={styles.header}><View><Text style={styles.eyebrow}>DEVELOPER PREVIEW</Text><Text style={styles.title}>Jump to a page</Text></View><MotionPressable accessibilityRole="button" accessibilityLabel="Close developer tools" onPress={() => setOpen(false)} style={styles.close}><Ionicons name="close" size={23} color="#102D40" /></MotionPressable></View><Text style={styles.description}>Skip the sign-in flow and explore any screen. Your saved workouts stay in place.</Text><View style={styles.grid}>{previewPages.map((target, i) => <MotionPressable key={target} accessibilityRole="button" accessibilityLabel={`Jump to ${titles[target]}`} accessibilityState={{ selected: page === target }} onPress={() => go(target)} style={[styles.tile, page === target && styles.selected]}><Text style={[styles.number, page === target && { color: '#D7F28C' }]}>{String(i + 1).padStart(2, '0')}</Text><Text style={[styles.tileTitle, page === target && { color: 'white' }]}>{titles[target]}</Text><Ionicons name="arrow-forward-outline" size={17} color={page === target ? 'white' : '#007E86'} /></MotionPressable>)}</View><Text style={styles.note}>Visible in development previews only.</Text></ScrollView></Entrance></View></Modal>
  </>;
}
const styles = StyleSheet.create({
  dock: { position: 'absolute', right: 16, zIndex: 100 }, toolbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#102D40', borderRadius: 24, borderWidth: 1, borderColor: '#345263', boxShadow: '0 5px 20px rgba(16,45,64,0.18)' }, devButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 13 }, devText: { color: '#D7F28C', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, separator: { width: 1, height: 17, backgroundColor: '#345263' }, nextButton: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 13 }, nextText: { color: 'white', fontSize: 11, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: '#102D4075', alignItems: 'center', justifyContent: 'center', padding: 20 }, panel: { width: '100%', maxWidth: 480, backgroundColor: '#F5F7F5', borderRadius: 26, maxHeight: '90%', overflow: 'hidden' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: '#007E86', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 }, title: { color: '#102D40', fontSize: 27, fontWeight: '800', marginTop: 7, letterSpacing: -0.8 }, close: { padding: 8, backgroundColor: '#E3EAE7', borderRadius: 22 }, description: { fontSize: 13, lineHeight: 20, color: '#647785' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, tile: { width: '48%', padding: 15, gap: 9, borderRadius: 14, borderWidth: 1, borderColor: '#DCE5E1', backgroundColor: 'white' }, selected: { backgroundColor: '#102D40', borderColor: '#102D40' }, number: { color: '#007E86', fontWeight: '700', fontSize: 11 }, tileTitle: { color: '#102D40', fontSize: 14, fontWeight: '700' }, note: { fontSize: 11, color: '#647785' },
});
