import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase Imports
import { db, auth } from '../firebase/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch 
} from 'firebase/firestore';

// Custom Configuration
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';

const NotificationsScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper: Relative Time
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    return `Just now`;
  };

  const handleMarkAllAsRead = async () => {
    const batch = writeBatch(db);
    notifications.filter(n => !n.isRead).forEach(n => 
      batch.update(doc(db, 'notifications', n.id), { isRead: true })
    );
    await batch.commit();
  };

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return;
    await updateDoc(doc(db, 'notifications', id), { isRead: true });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await deleteDoc(doc(db, 'notifications', id));
      }}
    ]);
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'Approved': return { icon: 'checkmark-circle-outline', color: '#81C784' };
      case 'Cancelled': return { icon: 'close-circle-outline', color: '#E57373' };
      case 'Requested': return { icon: 'reload-outline', color: '#FFB74D' };
      case 'Reminder': return { icon: 'notifications-outline', color: '#64B5F6' };
      default: return { icon: 'mail-outline', color: colors.gray };
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
          <View style={styles.squareCheckbox}>
            {notifications.length > 0 && notifications.every(n => n.isRead) && (
              <Ionicons name="checkmark" size={14} color={colors.black} />
            )}
          </View>
          <Text style={styles.utilityText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {notifications.map((item) => {
            const config = getNotificationConfig(item.type);
            return (
              <TouchableOpacity 
                activeOpacity={0.8}
                key={item.id} 
                onPress={() => markAsRead(item.id, item.isRead)}
                style={[styles.notifCard, !item.isRead && styles.unreadCard]}
              >
                {/* Top Section: Icon, Title, and Unread Dot */}
                <View style={styles.cardHeader}>
                  <View style={styles.titleGroup}>
                    <Ionicons name={config.icon} size={24} color={config.color} />
                    <Text style={styles.notifTitle}>Booking {item.type}</Text>
                  </View>
                  {!item.isRead && <View style={styles.redDot} />}
                </View>

                {/* Message Section */}
                <Text style={styles.notifMessage}>{item.message}</Text>
                
                {/* Bottom Section: Time and Delete Icon */}
                <View style={styles.cardFooter}>
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={14} color={colors.gray} />
                    <Text style={styles.timeText}>{getTimeAgo(item.createdAt)}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => handleDelete(item.id)} 
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  utilityRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 12 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  squareCheckbox: { width: 18, height: 18, borderWidth: 1, borderColor: colors.black, marginRight: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  utilityText: { fontWeight: 'bold', fontSize: 15, color: colors.black },
  scrollBody: { paddingHorizontal: 15, paddingBottom: 30 },
  notifCard: { backgroundColor: colors.white, borderRadius: 15, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0', elevation: 4 },
  unreadCard: { backgroundColor: '#FAF3D1', borderColor: '#D4C9A1' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  notifTitle: { marginLeft: 10, fontWeight: 'bold', fontSize: 17, color: colors.black },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D32F2F' },
  notifMessage: { fontSize: 14, color: '#333', lineHeight: 20, marginLeft: 34, marginBottom: 10 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginLeft: 34 
  },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { marginLeft: 5, fontSize: 13, color: colors.gray },
  deleteBtn: { 
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8
  },
});

export default NotificationsScreen;