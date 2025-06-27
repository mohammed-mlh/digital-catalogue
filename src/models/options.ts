import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Option } from "@/types/option"

const COLLECTION_NAME = "options"

export async function getAllOptions(): Promise<Option[]> {
  const optionsRef = collection(db, COLLECTION_NAME)
  const snapshot = await getDocs(optionsRef)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Option[]
}

export async function createOption(option: Omit<Option, "id">): Promise<Option> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), option)
  return {
    id: docRef.id,
    ...option
  }
}

export async function updateOption(id: string, option: Partial<Option>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, option)
}

export async function deleteOption(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id))
}

export async function getOptionById(id: string): Promise<Option | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      return null;
    }
  
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Option;
  }
  