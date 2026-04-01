import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Search, User, Map as MapIcon, Layers, Settings, Navigation, Car, BarChart3, Clock } from 'lucide-react-native';
import { useAntigravity } from '@/hooks/useAntigravity';
import GlassPanel from '@/components/GlassPanel';
import { DARK_MAP_STYLE } from '@/constants/MapStyle';

const { width, height } = Dimensions.get('window');

const SaaSMetric = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <View style={styles.metricContainer}>
    <Icon size={18} color="rgba(255, 255, 255, 0.7)" />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const TaskItem = ({ title, status, time }: { title: string, status: string, time: string }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskInfo}>
      <Text style={styles.taskTitle}>{title}</Text>
      <Text style={styles.taskStatus}>{status}</Text>
    </View>
    <Text style={styles.taskTime}>{time}</Text>
  </View>
);

export default function SaaSMapScreen() {
  const [search, setSearch] = useState('');
  
  // Antigravity animations for different panels
  const headerAnim = useAntigravity(0, 6, 2500);
  const fabAnim = useAntigravity(500, 4, 3000);
  const dashboardAnim = useAntigravity(1000, 5, 3500);

  return (
    <View style={styles.container}>
      {/* 1. Full-Screen Map Base */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {/* 2. Floating Antigravity Search Bar (Top) */}
      <Animated.View entering={FadeInUp.delay(200)} style={[styles.headerWrapper, headerAnim]}>
        <GlassPanel style={styles.searchBar}>
          <Search size={20} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Assets, Drivers..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.avatarButton}>
            <User size={20} color="#fff" />
          </TouchableOpacity>
        </GlassPanel>
      </Animated.View>

      {/* 3. Floating Action Menu (Right Edge) */}
      <Animated.View entering={FadeInDown.delay(400)} style={[styles.fabWrapper, fabAnim]}>
        <GlassPanel style={styles.fabItem}>
          <Navigation size={22} color="#fff" />
        </GlassPanel>
        <GlassPanel style={styles.fabItem}>
          <Layers size={22} color="#fff" />
        </GlassPanel>
        <GlassPanel style={styles.fabItem}>
          <Settings size={22} color="#fff" />
        </GlassPanel>
      </Animated.View>

      {/* 4. Glassmorphic SaaS Dashboard (Bottom Sheet) */}
      <Animated.View entering={FadeInDown.delay(600)} style={[styles.dashboardWrapper, dashboardAnim]}>
        <GlassPanel style={styles.dashboard}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>Fleet Overview</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <SaaSMetric icon={Car} label="Vehicles" value="24/30" />
            <SaaSMetric icon={BarChart3} label="Revenue" value="$4.2k" />
            <SaaSMetric icon={Clock} label="Avg Time" value="12m" />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Active Tasks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.taskScroll}>
            <TaskItem title="North Delivery" status="On Route" time="5m" />
            <TaskItem title="West Pickup" status="Delayed" time="15m" />
            <TaskItem title="East Logistics" status="Docked" time="2m" />
          </ScrollView>
        </GlassPanel>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  headerWrapper: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fabWrapper: {
    position: 'absolute',
    right: 20,
    top: height / 2 - 100,
    gap: 16,
    zIndex: 5,
  },
  fabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  dashboardWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  dashboard: {
    borderRadius: 32,
    padding: 24,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricContainer: {
    alignItems: 'flex-start',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  taskScroll: {
    flexDirection: 'row',
  },
  taskItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 12,
    color: '#4CD964',
  },
  taskTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 8,
  },
});
