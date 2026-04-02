import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Truck, DollarSign, Clock, ChevronRight } from 'lucide-react-native';
import { GlassPanel } from './GlassPanel';
import { useAntigravity } from '../hooks/useAntigravity';
import { APP_THEME } from '../constants/mapConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: color + '33' }]}>
      <Icon color={color} size={20} />
    </View>
    <View style={styles.statTextContainer}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const TaskRow = ({ id, status, time }: { id: string; status: string; time: string }) => (
  <TouchableOpacity style={styles.taskRow} activeOpacity={0.7}>
    <View style={styles.taskInfo}>
      <View style={styles.taskDot} />
      <Text style={styles.taskText}>{id}</Text>
      <Text style={styles.taskStatus}>{status}</Text>
    </View>
    <View style={styles.taskRight}>
      <Text style={styles.taskTime}>{time}</Text>
      <ChevronRight color={APP_THEME.colors.textSecondary} size={16} />
    </View>
  </TouchableOpacity>
);

export const SaaSBottomSheet = () => {
  const insets = useSafeAreaInsets();
  // Very slow and gentle floating for the large bottom sheet
  const floatingStyle = useAntigravity(6, 4000, 200);

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, 20) + 20 },
        floatingStyle,
      ]}
    >
      <GlassPanel intensity={35} style={styles.glassContainer}>
        {/* Handle bar indicator */}
        <View style={styles.handleBarContainer}>
          <View style={styles.handleBar} />
        </View>

        <View style={styles.content}>
          <Text style={styles.headerTitle}>Fleet Overview</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            <StatCard icon={Truck} label="Active Vehicles" value="42/50" color="#4ade80" />
            <StatCard icon={DollarSign} label="Today's Rev" value="$12.4k" color="#facc15" />
            <StatCard icon={Clock} label="Avg Wait" value="4m 12s" color="#60a5fa" />
          </ScrollView>

          <View style={styles.tasksContainer}>
            <Text style={styles.sectionTitle}>Recent Routes</Text>
            <TaskRow id="Route #1094" status="In Progress" time="12 min ago" />
            <TaskRow id="Route #1093" status="Completed" time="45 min ago" />
          </View>
        </View>
      </GlassPanel>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  glassContainer: {
    borderRadius: 32,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: APP_THEME.colors.glassBorder,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsScroll: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTextContainer: {
    justifyContent: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: APP_THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  tasksContainer: {
    marginTop: 4,
  },
  sectionTitle: {
    color: APP_THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 12,
  },
  taskText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 12,
  },
  taskStatus: {
    color: APP_THEME.colors.textSecondary,
    fontSize: 13,
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    color: APP_THEME.colors.textSecondary,
    fontSize: 13,
    marginRight: 8,
  },
});
