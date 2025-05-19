import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch books");

      setBooks((prevBooks) => {
        const newBooks = refresh ? data.books : [...prevBooks, ...data.books];
        const uniqueBooksMap = new Map();
        newBooks.forEach((book) => uniqueBooksMap.set(book._id, book));
        return Array.from(uniqueBooksMap.values());
      });

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books:", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: `https://api.dicebear.com/9.x/avataaars/svg?seed=${item.user.username}` }} style={styles.avatar}/> 
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit="cover" />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.rating}>{renderRatingPicker(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on: {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>📚 Bookworm App</Text>
      <Text style={styles.caption2}>Discover thinking of people's about books</Text>

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => fetchBooks(1, true)}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color="green"
              style={{ marginVertical: 16 }}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "green",
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bookImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "100%",
  },
  bookTitle: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    marginLeft: 5,
  },
  bookDetails: {
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,
    marginTop: 3,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 3,
    marginTop: 3,
    color: "gray",
  },
  caption: {
    marginLeft: 3,
    marginTop: 3,
    color: "brown",
    fontWeight: "500",
  },
  caption2:{
    fontWeight:"500",
    textAlign:"center",
    color:"gray",
    marginTop:-10,
    paddingBottom:10
  }
});
