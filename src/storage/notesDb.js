/**
 * notesDb.js — Penyimpanan Buku Catatan Belajar siswa berbasis IndexedDB (luring persisten)
 */

const DB_NAME = 'emodul_kka_notes_db';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB tidak didukung pada peramban ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('chapter', 'chapter', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Gagal membuka IndexedDB.'));
  });

  return dbPromise;
}

export async function initNotesDb() {
  try {
    await openDb();
    return true;
  } catch {
    return false;
  }
}

export async function getAllNotes() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = (req.result || []).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addNote({ chapter, title, content }) {
  const db = await openDb();
  const now = new Date().toISOString();
  const payload = {
    chapter: String(chapter || 'Umum').trim(),
    title: String(title || 'Catatan Tanpa Judul').trim(),
    content: String(content || '').trim(),
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(payload);
    req.onsuccess = () => resolve({ ...payload, id: req.result });
    req.onerror = () => reject(req.error);
  });
}

export async function updateNote(id, { chapter, title, content }) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(Number(id));

    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) {
        reject(new Error('Catatan tidak ditemukan.'));
        return;
      }
      const updated = {
        ...existing,
        chapter: String(chapter || existing.chapter).trim(),
        title: String(title || existing.title).trim(),
        content: String(content || '').trim(),
        updatedAt: new Date().toISOString(),
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve(updated);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function deleteNote(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(Number(id));
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function countNotes() {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result || 0);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return 0;
  }
}
