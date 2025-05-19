import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image as RNImage, // renamed to avoid conflict with expo-image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';
import { formatMemberSince, formatPublishDate } from '../../lib/utils';
import LogoutButton from '../../components/LogoutButton';
import { API_URL } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';

const renderRatingPicker = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={16}
        color={i <= rating ? "gold" : "green"}
      />
    );
  }
  return <View style={styles.ratingContainer}>{stars}</View>;
};

export default function Profile() {
  const { user, token } = useAuthStore();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);        // general loading (for fetch or delete)
  const [refreshing, setRefreshing] = useState(false);  // pull-to-refresh spinner

  const fetchBooks = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch books");

      setBooks(data);  // assume API returns array of books

    } catch (error) {
      console.log("Error fetching user books:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Delete a book after confirmation
  const handleDeleteBook = async (bookId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete book');
      }

      // After deleting, refresh the list
      await fetchBooks(true);

    } catch (error) {
      console.log('Error deleting book:', error);
      setLoading(false);
    }
  };

  // Confirmation alert before deleting a book
  const confirmDeleteBook = (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeleteBook(bookId),
        },
      ],
      { cancelable: false }
    );
  };

  // Pull to refresh handler
  const handleRefresh = () => {
    fetchBooks(true);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookDetails}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.rating}>{renderRatingPicker(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on: {formatPublishDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeleteBook(item._id)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.profileImage}` }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>🐛 {user.username}</Text>
          <Text style={styles.email}>📧 {user.email}</Text>
          <Text style={styles.joinedAt}>🗓️ Joined At : {formatMemberSince(user.createdAt)}</Text>
        </View>
      </View>

      <LogoutButton />

      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>Your Recommendations 📚</Text>

        {books.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <RNImage
              source={require('../../assets/images/bookEmpty.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>You have not recommended any books yet!</Text>
          </View>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListFooterComponent={
              loading && !refreshing ? <ActivityIndicator size="small" color="green" /> : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  userInfoContainer: {
    borderWidth: 0.2,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    gap: 10,
    paddingBottom:20
  },
  profileImage: {
    height: 65,
    width: 65,
    borderRadius: 99,
    marginLeft: 10,
  },
  username: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  email: {
    color: "green",
    fontSize: 14,
  },
  joinedAt: {
    color: "brown",
    fontSize: 13,
  },
  recommendationContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    marginLeft:10
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  bookDetails: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    gap: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    marginTop: 5,
  },
  caption: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  date: {
    marginTop: 5,
    color: '#999',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  image: {
    height: 100,
    width: 80,
    borderRadius: 7,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
