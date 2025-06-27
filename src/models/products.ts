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
import { getOptionById } from "./options"
import { Option } from "@/types/option"

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
    ...currentProduct,
    ...product,
    id,
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

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  const productsRef = collection(db, COLLECTION_NAME)
  const q = query(
    productsRef,
    where("name", ">=", searchQuery),
    where("name", "<=", searchQuery + "\uf8ff")
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

export async function getProductsWithOptions(): Promise<(Product & { options: Option[] })[]> {
  const products = await getProducts();

  // For each product, fetch all options by optionIds in parallel
  const productsWithOptions = await Promise.all(
    products.map(async (product) => {
      const options = await Promise.all(
        (product.optionIds || []).map(async (optionId) => {
          const option = await getOptionById(optionId);
          if (!option) {
            console.warn(`Option with id ${optionId} not found`);
            return null;
          }
          return option;
        })
      );

      // Filter out nulls if any option is missing
      const filteredOptions = options.filter((opt): opt is Option => opt !== null);

      return {
        ...product,
        options: filteredOptions,
      };
    })
  );

  return productsWithOptions;
}