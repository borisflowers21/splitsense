import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Ellipse, Line } from 'react-native-svg';

import { Entrance, Floating, MotionPressable as Pressable } from './Motion';

export type Mode = 'welcome' | 'login' | 'create';
const navy = '#102D40', teal = '#007E86', paper = '#F5F7F5', muted = '#647785';

export default function Welcome({ onContinue, mode, onModeChange }: { onContinue: () => void; mode: Mode; onModeChange: (mode: Mode) => void }) {
  const [focused, setFocused] = useState<string | null>(null);
  const [provider, setProvider] = useState<'Google' | 'Apple' | null>(null);
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false), [error, setError] = useState('');
  function changeMode(next: Mode) { onModeChange(next); setPassword(''); setError(''); setShowPassword(false); }
  function continueDemo() { setPassword(''); setProvider(null); onContinue(); }
  function submit() {
    if (mode === 'create' && !name.trim()) return setError('Enter your name to preview account creation.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter an email address, such as rower@example.com.');
    if (password.length < 8) return setError('Use at least 8 characters for the demo password.');
    continueDemo();
  }
  function socialButtons() {
    return <View style={{ gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={() => setProvider('Google')} style={styles.social}><Ionicons name="logo-google" size={21} color="#4285F4" /><Text style={styles.socialText}>Continue with Google</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => setProvider('Apple')} style={[styles.social, { backgroundColor: navy, borderColor: navy }]}><Ionicons name="logo-apple" size={23} color="white" /><Text style={[styles.socialText, { color: 'white' }]}>Continue with Apple</Text></Pressable>
    </View>;
  }
  return <View style={styles.outer}><SafeAreaView style={styles.page}><StatusBar style="dark" /><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}><Entrance trigger={mode} style={{ gap: 18 }}>
    <View style={styles.top}><View style={styles.brand}><Ionicons name="water" size={24} color={teal} /><Text style={styles.logo}>SplitSense</Text></View><Text style={styles.previewTag}>PREVIEW</Text></View>
    {mode === 'welcome' ? <>
      <View style={styles.hero}><View style={styles.heroTop}><Text style={styles.heroLabel}>FOR THE EARLY MORNINGS. AND THE FINISH LINE.</Text><Ionicons name="boat-outline" size={31} color="#D7F28C" /></View><Text style={styles.heroTitle}>Make every{'\n'}split count.</Text><Text style={styles.heroBody}>From the first stroke to your next personal best. Built around the way you row.</Text><Floating><Svg accessibilityLabel="Rowing boat illustration" width="100%" height={100} viewBox="0 0 360 100"><Path d="M-20 20 Q70 0 160 20 T380 20 M-20 48 Q70 28 160 48 T380 48 M-20 80 Q70 60 160 80 T380 80" stroke="#2B5260" strokeWidth={1} fill="none" /><Ellipse cx={180} cy={48} rx={119} ry={5} fill="#79D5BE" /><Line x1={178} y1={48} x2={120} y2={10} stroke="#D7F28C" strokeWidth={3} /><Line x1={185} y1={48} x2={244} y2={86} stroke="#D7F28C" strokeWidth={3} /><Path d="M117 6 L128 12 L119 19 L109 11 Z M244 79 L254 87 L247 96 L235 87 Z" fill="#D7F28C" /><Circle cx={182} cy={34} r={6} fill="#F5F7F5" /><Path d="M181 42 L189 48 L172 49" stroke="#F5F7F5" strokeWidth={5} fill="none" /></Svg></Floating><View style={styles.featureRow}>{[['barbell-outline', 'Train'], ['stats-chart-outline', 'Track'], ['water-outline', 'Improve']].map(([icon, label]) => <View key={label} style={styles.feature}><Ionicons name={icon as 'water-outline'} size={19} color="#D7F28C" /><Text style={styles.featureText}>{label}</Text></View>)}</View></View>
      <View style={{ gap: 7 }}><Text style={styles.title}>A better row starts here.</Text><Text style={styles.subtitle}>Train with purpose. Track what matters.</Text></View>
      <Pressable accessibilityRole="button" onPress={() => changeMode('create')} style={styles.primary}><Text style={styles.primaryText}>Create Account</Text><Ionicons name="arrow-forward" size={20} color="white" /></Pressable>
      <Pressable accessibilityRole="button" onPress={() => changeMode('login')} style={styles.outline}><Text style={styles.socialText}>Log In</Text></Pressable>
    </> : <>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to welcome" onPress={() => changeMode('welcome')} style={styles.back}><Ionicons name="arrow-back" size={20} color={teal} /><Text style={styles.link}>Back</Text></Pressable>
      <View style={{ gap: 8 }}><Text style={styles.formTitle}>{mode === 'login' ? 'Welcome back.' : 'Join the crew.'}</Text><Text style={styles.subtitle}>{mode === 'login' ? 'Your next great session is waiting.' : 'Start building your rowing story.'}</Text></View>
      {mode === 'create' && <View style={styles.field}><Text style={styles.label}>Full name</Text><TextInput accessibilityLabel="Full name" value={name} onChangeText={setName} placeholder="Alex Morgan" placeholderTextColor={muted} style={[styles.input, focused === "name" && styles.focused]} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} maxLength={100} autoComplete="off" /></View>}
      <View style={styles.field}><Text style={styles.label}>Email</Text><TextInput accessibilityLabel="Email" value={email} onChangeText={setEmail} placeholder="rower@example.com" placeholderTextColor={muted} style={[styles.input, focused === "email" && styles.focused]} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} keyboardType="email-address" autoCapitalize="none" autoComplete="off" autoCorrect={false} maxLength={200} /></View>
      <View style={styles.field}><Text style={styles.label}>Password</Text><View style={[styles.passwordRow, focused === "password" && styles.focused]}><TextInput accessibilityLabel="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor={muted} style={[styles.input, { flex: 1, borderWidth: 0 }]} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} autoComplete="off" maxLength={128} /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword(!showPassword)} style={{ padding: 15 }}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={muted} /></Pressable></View></View>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Pressable accessibilityRole="button" onPress={submit} style={styles.primary}><Text style={styles.primaryText}>{mode === 'login' ? 'Log In' : 'Create Account'}</Text><Ionicons name="arrow-forward" size={20} color="white" /></Pressable>
      <Pressable accessibilityRole="button" onPress={() => changeMode(mode === 'login' ? 'create' : 'login')} style={{ alignItems: 'center', padding: 6 }}><Text style={styles.subtitle}>{mode === 'login' ? 'New to SplitSense? ' : 'Already have an account? '}<Text style={styles.link}>{mode === 'login' ? 'Create Account' : 'Log In'}</Text></Text></Pressable>
    </>}
    <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>or continue with</Text><View style={styles.line} /></View>
    {socialButtons()}
    <Text style={styles.demoNote}>Demo only · Accounts aren’t connected yet. Use example details; nothing entered here is saved or sent.</Text>
    <Pressable accessibilityRole="button" onPress={continueDemo} style={styles.skip}><Text style={styles.link}>Explore the demo →</Text></Pressable>
  </Entrance></ScrollView></KeyboardAvoidingView>
  <Modal visible={!!provider} transparent animationType="fade" onRequestClose={() => setProvider(null)}><View style={styles.overlay}><View style={styles.dialog}><Ionicons name={provider === 'Apple' ? 'logo-apple' : 'logo-google'} size={38} color={navy} /><Text style={styles.title}>{provider} sign-in preview</Text><Text style={styles.subtitle}>This button will connect to {provider} when accounts are ready. For now, you can continue into the SplitSense demo.</Text><Pressable accessibilityRole="button" onPress={continueDemo} style={styles.primary}><Text style={styles.primaryText}>Continue to demo</Text></Pressable><Pressable accessibilityRole="button" onPress={() => setProvider(null)} style={styles.skip}><Text style={styles.link}>Back to sign-in</Text></Pressable></View></View></Modal>
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#E8EEEA', alignItems: 'center' }, page: { flex: 1, width: '100%', maxWidth: 560, backgroundColor: paper }, content: { padding: 24, gap: 18, paddingBottom: 85 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, marginBottom: 6 }, brand: { flexDirection: 'row', gap: 8, alignItems: 'center' }, logo: { color: navy, fontSize: 24, fontWeight: '800', letterSpacing: -0.8 }, previewTag: { color: teal, backgroundColor: '#E1F2EE', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  hero: { backgroundColor: navy, borderRadius: 28, padding: 26, gap: 16, boxShadow: '0 10px 24px rgba(16,45,64,0.10)' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, heroLabel: { maxWidth: 230, lineHeight: 16, color: '#D7F28C', fontSize: 10, letterSpacing: 1.7, fontWeight: '700' }, heroTitle: { color: 'white', fontSize: 46, fontWeight: '800', letterSpacing: -1.5, lineHeight: 50 }, heroBody: { color: '#CBDADD', fontSize: 15, lineHeight: 23, maxWidth: 350 }, featureRow: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' }, feature: { flexDirection: 'row', gap: 7, alignItems: 'center' }, featureText: { color: '#DFEBE8', fontSize: 12, fontWeight: '600' },
  title: { color: navy, fontSize: 22, fontWeight: '800', letterSpacing: -0.6 }, formTitle: { color: navy, fontSize: 34, fontWeight: '800', letterSpacing: -1 }, subtitle: { color: muted, fontSize: 14, lineHeight: 22 },
  primary: { backgroundColor: teal, padding: 17, borderRadius: 13, minHeight: 54, flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: 'white', fontWeight: '700', fontSize: 16 }, outline: { padding: 17, minHeight: 54, borderRadius: 13, borderWidth: 1, borderColor: '#CDDAD6', alignItems: 'center', backgroundColor: 'white' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 2 }, line: { flex: 1, height: 1, backgroundColor: '#DDE5E1' }, or: { color: muted, fontSize: 12 }, social: { backgroundColor: 'white', borderWidth: 1, borderColor: '#DDE5E1', borderRadius: 13, minHeight: 54, padding: 15, boxShadow: '0 2px 8px rgba(16,45,64,0.025)', flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' }, socialText: { color: navy, fontSize: 15, fontWeight: '600' },
  field: { gap: 8 }, label: { color: navy, fontSize: 14, fontWeight: '600' }, focused: { borderColor: teal, borderWidth: 1.5, backgroundColor: '#FCFFFD' }, input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#DDE5E1', borderRadius: 12, padding: 16, fontSize: 16, minHeight: 54, color: navy }, passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDE5E1', borderRadius: 12, backgroundColor: 'white', overflow: 'hidden' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 8 }, link: { color: teal, fontSize: 14, fontWeight: '700' }, skip: { alignItems: 'center', padding: 10 }, demoNote: { color: muted, fontSize: 11, lineHeight: 17, textAlign: 'center' }, error: { color: '#AB3843', fontSize: 14 },
  overlay: { flex: 1, backgroundColor: '#102D4090', justifyContent: 'center', alignItems: 'center', padding: 24 }, dialog: { width: '100%', maxWidth: 420, backgroundColor: paper, borderRadius: 24, padding: 26, gap: 18 },
});
