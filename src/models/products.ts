import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Product } from "@/types/product"

const COLLECTION_NAME = "products"

export async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, COLLECTION_NAME)
  const q = query(productsRef, orderBy("name"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, COLLECTION_NAME, id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Product
}

export async function createProduct(product: Omit<Product, "id">, imageFile?: File): Promise<Product> {
  let imageUrl = product.image

  if (imageFile) {
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
    await uploadBytes(storageRef, imageFile)
    imageUrl = await getDownloadURL(storageRef)
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...product,
    image: imageUrl
  })

  return {
    id: docRef.id,
    ...product,
    image: imageUrl
  } as Product
}

export async function updateProduct(
  id: string, 
  product: Partial<Product>, 
  imageFile?: File
): Promise<Product> {
  const docRef = doc(db, COLLECTION_NAME, id)
  const currentProduct = await getProduct(id)

  if (!currentProduct) {
    throw new Error("Product not found")
  }

  let imageUrl = product.image || currentProduct.image

  if (imageFile) {
    // Delete old image if it exists and is from our storage
    if (currentProduct.image.includes("firebasestorage.googleapis.com")) {
      const oldImageRef = ref(storage, currentProduct.image)
      try {
        await deleteObject(oldImageRef)
      } catch (error) {
        console.error("Error deleting old image:", error)
      }
    }

    // Upload new image
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
    await uploadBytes(storageRef, imageFile)
    imageUrl = await getDownloadURL(storageRef)
  }

  await updateDoc(docRef, {
    ...product,
    image: imageUrl
  })

  return {
    id,
    ...currentProduct,
    ...product,
    image: imageUrl
  } as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const product = await getProduct(id)
  
  if (!product) {
    throw new Error("Product not found")
  }

  // Delete image from storage if it exists
  if (product.image.includes("firebasestorage.googleapis.com")) {
    const imageRef = ref(storage, product.image)
    try {
      await deleteObject(imageRef)
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  await deleteDoc(doc(db, COLLECTION_NAME, id))
}

export async function searchProducts(query: string): Promise<Product[]> {
  const productsRef = collection(db, COLLECTION_NAME)
  const q = query(
    productsRef,
    where("name", ">=", query),
    where("name", "<=", query + "\uf8ff")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const productsRef = collection(db, COLLECTION_NAME)
  const q = query(
    productsRef,
    where("category", "==", category)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
} 