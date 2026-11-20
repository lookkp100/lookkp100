// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithPopup
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQDp9EFKLRkjM1T54kQytIDzajBGWgdfU",
  authDomain: "study-planner-ac709.firebaseapp.com",
  projectId: "study-planner-ac709",
  storageBucket: "study-planner-ac709.firebasestorage.app",
  messagingSenderId: "1033544531613",
  appId: "1:1033544531613:web:89ea2e20e1d886c8a19e74"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const SUBJECTS_DATA = [
  {
    id: 'physics', name: 'الفيزياء', chapters: [
      { id: 'phy-c1', name: 'الفصل الأول: المتسعات', topics: ['السعة الكهربائية', 'ربط المتسعات', 'الطاقة المخزونة'] },
      { id: 'phy-c2', name: 'الفصل الثاني: الحث الكهرومغناطيسي', topics: ['قانون فاراداي', 'قانون لنز', 'المحاثة'] }
    ]
  },
  {
    id: 'chemistry', name: 'الكيمياء', chapters: [
      { id: 'chem-c1', name: 'الفصل الأول: الاتزان الكيميائي', topics: ['ثابت الاتزان', 'مبدأ لوشاتليه', 'الاتزان الأيوني'] },
      { id: 'chem-c2', name: 'الفصل الثاني: الحموض والقواعد', topics: ['الرقم الهيدروجيني', 'المحاليل المنظمة'] }
    ]
  },
  {
    id: 'math', name: 'الرياضيات', chapters: [
      { id: 'math-c1', name: 'الفصل الأول: الأعداد المركبة', topics: ['العمليات على الأعداد المركبة', 'الصيغة القطبية', 'نظرية ديموافر'] },
      { id: 'math-c2', name: 'الفصل الثاني: التكامل', topics: ['التكامل المحدود', 'المساحات', 'الحجوم الدورانية'] }
    ]
  },
  {
    id: 'biology', name: 'الأحياء', chapters: [
      { id: 'bio-c1', name: 'الفصل الأول: التكاثر', topics: ['تكوين الأمشاج', 'الإخصاب'] },
      { id: 'bio-c2', name: 'الفصل الثاني: الوراثة', topics: ['قوانين مندل', 'الوراثة المرتبطة بالجنس'] }
    ]
  },
  { id: 'arabic', name: 'العربي', chapters: [{ id: 'ar-c1', name: 'النحو', topics: ['المبتدأ والخبر', 'الأفعال الخمسة', 'أسلوب الشرط'] }] },
  { id: 'english', name: 'الإنجليزي', chapters: [{ id: 'en-c1', name: 'Grammar', topics: ['Conditionals', 'Passive voice', 'Reported speech'] }] },
  { id: 'islamic', name: 'الإسلامية', chapters: [{ id: 'is-c1', name: 'الفصل الأول', topics: ['الإيمان بالله', 'أحكام الصيام'] }] }
];

export function resolveTopicTitle(key) {
  const [chapId, idxStr] = key.split('|');
  const idx = Number(idxStr);
  for (const s of SUBJECTS_DATA) {
    const ch = s.chapters.find(c => c.id === chapId);
    if (ch && ch.topics[idx]) return `${s.name}: ${ch.topics[idx]}`;
  }
  return key;
}

export async function loginWithGoogle() {
  const res = await signInWithPopup(auth, provider);
  await ensureUserDoc(res.user);
  return res.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function ensureUserDoc(user) {
  if (!user) return null;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const defaultProfile = {
      displayName: user.displayName || "طالب السادس",
      email: user.email || "",
      platformDone: [],
      customTasks: [],
      joinedRooms: [],
      privacy: { progress: "friends", topics: "friends" },
      friends: [],
      createdAt: serverTimestamp()
    };
    await setDoc(ref, defaultProfile);
    return defaultProfile;
  }
  return snap.data();
}

export async function deleteUserAccountCompletely(user) {
  if (!user) return;
  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  } catch (err) {
    if (err.code === "auth/requires-recent-login") {
      await reauthenticateWithPopup(user, provider);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
    } else {
      throw err;
    }
  }
}

export {
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
};