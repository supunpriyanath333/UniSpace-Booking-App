import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Custom Configuration
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';

const NotificationsScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'Approved',
      title: 'Booking Approved',
      message: 'Your booking for Lecture Hall 101 on Jan 31, 2026 at 9:00 AM has been confirmed.',
      time: '13 Hours ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'Cancelled',
      title: 'Booking Cancelled',
      message: 'Your booking for Lecture Hall 105 on Jan 28, 2026 has been cancelled.',
      time: '18 Hours ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'Requested',
      title: 'Booking Requested',
      message: 'Your booking request has been successfully created for Lecture Hall 101 on Jan 31, 2026 at 9:00 AM. It will be approved shortly.',
      time: '1 day ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'Reminder',
      title: 'Booking Reminder',
      message: 'You have a booking for Lecture Hall 201 tomorrow at 11:00 AM.',
      time: '2 days ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'Declined',
      title: 'Booking Declined',
      message: 'Your booking for Lecture Hall 102 on Feb 05, 2026 has been declined due to maintenance.',
      time: '3 days ago',
      isRead: true,
    }
  ]);

  // 1. Mark All as Read
  const handleMarkAllAsRead = () => {
    const updatedNotifs = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updatedNotifs);
  };

  // 2. Mark Single as Read on Press
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  // 3. Delete Notification
  const deleteNotification = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to remove this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
          } 
        }
      ]
    );
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'Approved': return { icon: 'checkmark-circle', color: '#4CAF50' };
      case 'Cancelled':
      case 'Declined': return { icon: 'close-circle', color: colors.primary };
      case 'Requested': return { icon: 'sync-outline', color: '#FF9800' };
      case 'Reminder': return { icon: 'notifications', color: '#2196F3' };
      default: return { icon: 'chatbubble-outline', color: colors.gray };
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor={colors.secondary} translucent={true} />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={GlobalStyles.headerSection}>
            <View style={GlobalStyles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color={colors.black} />
              </TouchableOpacity>
              <Text style={GlobalStyles.headerTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.utilityRow}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done-all" size={22} color={colors.black} />
          <Text style={styles.utilityText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => {
          const config = getNotificationConfig(item.type);
          return (
            <TouchableOpacity 
              activeOpacity={0.9}
              key={item.id} 
              onPress={() => markAsRead(item.id)}
              style={[styles.notifCard, !item.isRead && styles.unreadCard]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleGroup}>
                  <Ionicons name={config.icon} size={24} color={config.color} />
                  <Text style={styles.notifTitle}>{item.title}</Text>
                </View>
                <View style={styles.headerActions}>
                  {!item.isRead && <View style={styles.unreadDot} />}
                  <TouchableOpacity 
                    onPress={() => deleteNotification(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.notifMessage}>{item.message}</Text>
              
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color={colors.gray} />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  utilityRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  utilityText: { marginLeft: 6, fontWeight: 'bold', fontSize: 14, color: colors.black },
  scrollBody: { paddingHorizontal: 15, paddingBottom: 30 },
  notifCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 3,
  },
  unreadCard: { backgroundColor: '#FAF3D1', borderColor: colors.secondary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  notifTitle: { marginLeft: 10, fontWeight: 'bold', fontSize: 16, color: colors.black },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginRight: 10 },
  deleteBtn: { padding: 5 },
  notifMessage: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { marginLeft: 5, fontSize: 12, color: colors.gray },
});

export default NotificationsScreen;