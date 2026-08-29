import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const REPORTS_COLLECTION = 'civiclens_reports';
const HOTSPOTS_COLLECTION = 'civiclens_hotspots';

/**
 * Subscribe to real-time reports updates from Firestore
 */
export function subscribeToReports(onData, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('submittedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const reports = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onData(reports);
        }
      },
      (err) => {
        console.warn('[Firestore] Reports subscription warning:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (e) {
    console.warn('[Firestore] Error subscribing to reports:', e.message);
    return () => {};
  }
}

/**
 * Subscribe to real-time hotspots updates from Firestore
 */
export function subscribeToHotspots(onData, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const q = query(collection(db, HOTSPOTS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const hotspots = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onData(hotspots);
        }
      },
      (err) => {
        console.warn('[Firestore] Hotspots subscription warning:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (e) {
    console.warn('[Firestore] Error subscribing to hotspots:', e.message);
    return () => {};
  }
}

/**
 * Save or update a report in Firestore
 */
export async function syncReportToFirestore(report) {
  if (!isFirebaseConfigured || !db || !report?.id) return false;

  try {
    const reportRef = doc(db, REPORTS_COLLECTION, report.id);
    await setDoc(reportRef, report, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Failed to sync report:', err.message);
    return false;
  }
}

/**
 * Save or update a hotspot in Firestore
 */
export async function syncHotspotToFirestore(hotspot) {
  if (!isFirebaseConfigured || !db || !hotspot?.id) return false;

  try {
    const hotspotRef = doc(db, HOTSPOTS_COLLECTION, hotspot.id);
    await setDoc(hotspotRef, hotspot, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Failed to sync hotspot:', err.message);
    return false;
  }
}

/**
 * Seed initial data if Firestore collections are empty
 */
export async function seedFirestoreCollectionsIfEmpty(initialReports, initialHotspots) {
  if (!isFirebaseConfigured || !db) return;

  try {
    const reportsSnap = await getDocs(collection(db, REPORTS_COLLECTION));
    if (reportsSnap.empty) {
      console.info('[Firestore] Seeding initial reports collection...');
      const batch = writeBatch(db);
      initialReports.forEach(r => {
        const ref = doc(db, REPORTS_COLLECTION, r.id);
        batch.set(ref, r);
      });
      await batch.commit();
    }

    const hotspotsSnap = await getDocs(collection(db, HOTSPOTS_COLLECTION));
    if (hotspotsSnap.empty) {
      console.info('[Firestore] Seeding initial hotspots collection...');
      const batch = writeBatch(db);
      initialHotspots.forEach(h => {
        const ref = doc(db, HOTSPOTS_COLLECTION, h.id);
        batch.set(ref, h);
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('[Firestore] Seeding error, running with local data:', err.message);
  }
}

/**
 * Reset Firestore collections back to initial seeded baseline
 */
export async function resetFirestoreCollections(initialReports, initialHotspots) {
  if (!isFirebaseConfigured || !db) return;

  try {
    const batch = writeBatch(db);
    
    // Clear and rewrite reports
    const reportsSnap = await getDocs(collection(db, REPORTS_COLLECTION));
    reportsSnap.docs.forEach(docSnap => batch.delete(docSnap.ref));
    initialReports.forEach(r => {
      batch.set(doc(db, REPORTS_COLLECTION, r.id), r);
    });

    // Clear and rewrite hotspots
    const hotspotsSnap = await getDocs(collection(db, HOTSPOTS_COLLECTION));
    hotspotsSnap.docs.forEach(docSnap => batch.delete(docSnap.ref));
    initialHotspots.forEach(h => {
      batch.set(doc(db, HOTSPOTS_COLLECTION, h.id), h);
    });

    await batch.commit();
    console.info('[Firestore] Successfully reset Firestore collections to baseline.');
  } catch (err) {
    console.warn('[Firestore] Reset error:', err.message);
  }
}
