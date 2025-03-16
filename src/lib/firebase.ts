
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  Timestamp,
  onSnapshot,
  DocumentData,
  writeBatch
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAkDFsxp_l_xEjcF1psfIXjBZ_-EJ0zAA",
  authDomain: "cab-book-6a419.firebaseapp.com",
  projectId: "cab-book-6a419",
  storageBucket: "cab-book-6a419.firebasestorage.app",
  messagingSenderId: "324836276421",
  appId: "1:324836276421:web:44e074147b9a76403dd8ac",
  measurementId: "G-QHWFXEJNXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Admin user credentials
export const ADMIN_EMAIL = "admin@cabbook.com";
export const ADMIN_PASSWORD = "admin123";

// Function to ensure admin user exists
export const ensureAdminExists = async () => {
  try {
    // Check if admin user exists in users collection
    const adminSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", ADMIN_EMAIL))
    );
    
    if (adminSnapshot.empty) {
      // Try to create admin user
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          ADMIN_EMAIL, 
          ADMIN_PASSWORD
        );
        
        // Create admin user profile
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: "Admin User",
          email: ADMIN_EMAIL,
          phone: "+91 9876543210",
          role: "admin",
          createdAt: Timestamp.now()
        });
        
        console.log("Admin user created successfully");
      } catch (error: any) {
        // If admin already exists in auth but not in firestore
        if (error.code === "auth/email-already-in-use") {
          // Try to sign in and get uid
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              ADMIN_EMAIL,
              ADMIN_PASSWORD
            );
            
            // Create admin user profile if it doesn't exist
            await setDoc(doc(db, "users", userCredential.user.uid), {
              name: "Admin User",
              email: ADMIN_EMAIL,
              phone: "+91 9876543210",
              role: "admin",
              createdAt: Timestamp.now()
            });
            
            // Sign out after creating
            await firebaseSignOut(auth);
          } catch (signInError) {
            console.error("Error ensuring admin exists:", signInError);
          }
        } else {
          console.error("Error creating admin user:", error);
        }
      }
    } else {
      // Make sure admin has admin role
      const adminDoc = adminSnapshot.docs[0];
      if (adminDoc.data().role !== "admin") {
        await updateDoc(doc(db, "users", adminDoc.id), {
          role: "admin"
        });
      }
    }
  } catch (error) {
    console.error("Error checking for admin user:", error);
  }
};

// Authentication functions
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string, name: string, phone: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    phone,
    role: "user", // Default role
    createdAt: Timestamp.now()
  });
  
  return userCredential;
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  return updateDoc(userRef, data);
};

// Booking functions
export const createBooking = async (bookingData: any) => {
  const bookingsRef = collection(db, "bookings");
  const newBookingRef = doc(bookingsRef);
  
  await setDoc(newBookingRef, {
    ...bookingData,
    status: "pending",
    createdAt: Timestamp.now(),
    bookingId: newBookingRef.id
  });
  
  return newBookingRef.id;
};

export const getUserBookings = async (userId: string) => {
  try {
    const bookingsRef = collection(db, "bookings");
    // Simple query without orderBy to avoid index requirement
    const q = query(
      bookingsRef, 
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on client side instead of in the query
    return bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const bookingsRef = collection(db, "bookings");
    // Simple query without orderBy to avoid index requirement
    const querySnapshot = await getDocs(bookingsRef);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on client side instead of in the query
    return bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const bookingRef = doc(db, "bookings", bookingId);
  return updateDoc(bookingRef, { 
    status,
    updatedAt: Timestamp.now()
  });
};

// Real-time listeners with client-side sorting to avoid index requirements
export const onUserBookingsChange = (userId: string, callback: (bookings: DocumentData[]) => void) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef, 
    where("userId", "==", userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on client side
    const sortedBookings = bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    callback(sortedBookings);
  });
};

export const onAllBookingsChange = (callback: (bookings: DocumentData[]) => void) => {
  const bookingsRef = collection(db, "bookings");
  
  return onSnapshot(bookingsRef, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort on client side
    const sortedBookings = bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    callback(sortedBookings);
  });
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export { app, auth, db, storage };
