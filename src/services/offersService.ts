import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db as firestoreDb } from './firebase';

export interface NewOfferData {
  title: string;
  shopName: string;
  category?: string;
  discount: string;
  description?: string;
  phone: string;
  imageUrl?: string;
  ownerUid?: string;
  paymentId?: string;
  paymentMethod?: string;
  amountPaid?: number;
}

/**
 * 24-Hour Expiration Logic:
 * Submits a new offer to the Firestore 'offers' collection with an expiresAt timestamp
 * set to exactly 24 hours from the current time.
 */
export async function createOffer(data: NewOfferData) {
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const finalImage = data.imageUrl?.trim() || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';

  const docRef = await addDoc(collection(firestoreDb, 'offers'), {
    title: data.title.trim(),
    name: data.shopName.trim(),
    shopName: data.shopName.trim(),
    category: data.category || 'कपडे',
    discount: data.discount.trim(),
    offerDiscount: data.discount.trim(),
    offerBanner: data.title.trim(),
    description: (data.description || '').trim(),
    offerDesc: (data.description || '').trim(),
    phone: data.phone.trim(),
    imageUrl: finalImage,
    logo: finalImage,
    photos: [finalImage],
    ownerUid: data.ownerUid || '',
    paymentStatus: 'paid',
    amountPaid: data.amountPaid ?? 49,
    paymentId: data.paymentId || '',
    paymentMethod: data.paymentMethod || 'online',
    status: 'active',
    createdAt: serverTimestamp(),
    expiresAt, // Exactly 24 hours ahead
  });

  return docRef.id;
}

/**
 * Returns a Firestore query that filters only non-expired offers:
 * expiresAt > current time (Timestamp.now())
 */
export function getActiveOffersQuery() {
  return query(
    collection(firestoreDb, 'offers'),
    where('expiresAt', '>', Timestamp.now())
  );
}

/**
 * Real-time listener for active non-expired offers.
 * Automatically excludes offers that have passed their 24-hour expiration.
 */
export function subscribeToActiveOffers(
  onUpdate: (offers: any[]) => void,
  onError?: (error: any) => void
) {
  const q = getActiveOffersQuery();

  return onSnapshot(
    q,
    (snapshot: any) => {
      const nowMs = Date.now();
      const offers: any[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        // Secondary client-side guard for strict 24-hour validity
        const expTime = data.expiresAt?.toDate
          ? data.expiresAt.toDate().getTime()
          : data.expiresAt
          ? new Date(data.expiresAt).getTime()
          : null;

        if (!expTime || expTime > nowMs) {
          offers.push({ id: doc.id, ...data });
        }
      });
      onUpdate(offers);
    },
    (error: any) => {
      console.error('Error fetching active offers:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * One-time fetch for active non-expired offers.
 */
export async function fetchActiveOffers() {
  const q = getActiveOffersQuery();
  const snapshot: any = await getDocs(q);
  const nowMs = Date.now();
  const offers: any[] = [];
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    const expTime = data.expiresAt?.toDate
      ? data.expiresAt.toDate().getTime()
      : data.expiresAt
      ? new Date(data.expiresAt).getTime()
      : null;

    if (!expTime || expTime > nowMs) {
      offers.push({ id: doc.id, ...data });
    }
  });
  return offers;
}
