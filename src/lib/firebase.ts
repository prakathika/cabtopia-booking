
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
  DocumentData
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
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef, 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllBookings = async () => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const bookingRef = doc(db, "bookings", bookingId);
  return updateDoc(bookingRef, { 
    status,
    updatedAt: Timestamp.now()
  });
};

// Real-time listeners
export const onUserBookingsChange = (userId: string, callback: (bookings: DocumentData[]) => void) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef, 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
  });
};

export const onAllBookingsChange = (callback: (bookings: DocumentData[]) => void) => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
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
