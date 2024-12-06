// src/app/services/firebase.service.ts
import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, updateDoc, getDocs, query, where, writeBatch } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';
import { Estacionamiento } from '../models/estacionamiento.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  constructor() {
    //this.initializeParkingCollection();
  }

  // **** AUTENTICACIÓN ****
  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  resetUserData() {
    localStorage.removeItem('user');
  }

  // **** BASE DE DATOS ****

  async getUserRole(uid: string) {
    try {
      const db = getFirestore();
      const userRef = doc(db, `users/${uid}`);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data()['role'] : null;
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return null;
    }
  }

  async setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    const docSnap = await getDoc(doc(getFirestore(), path));
    return docSnap.exists() ? docSnap.data() : null;
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // ** Obtenemos todos los documentos de una colección como un Observable **
  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).valueChanges();
  }

  async getDataByRole(coleccion: string, rol: string) {
    const db = getFirestore();
    const colRef = collection(db, coleccion);
    const q = query(colRef, where('creadoPor', '!=', rol));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getAllData(coleccion: string) {
    const db = getFirestore();
    const colRef = collection(db, coleccion);
    const querySnapshot = await getDocs(colRef);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // **** GESTIÓN DE PARKING ****

  // Obtener todos los documentos de una colección
  getParkingDocuments(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).valueChanges();
  }

  async addParkingDocument(collectionName: string, docId: string, data: any) {
    return setDoc(doc(getFirestore(), `${collectionName}/${docId}`), data);
  }

  async updateParkingDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  async deleteParkingDocument(path: string) {
    return updateDoc(doc(getFirestore(), path), { deleted: true });
  }

  async hasPermissionToEditParking(uid: string, parkingId: number): Promise<boolean> {
    const userRole = await this.getUserRole(uid);
    if (userRole === 'Conserje') {
      return parkingId >= 1 && parkingId <= 20;
    }
    if (userRole === 'Residente') {
      return parkingId >= 21 && parkingId <= 200;
    }
    return false;
  }

  // Inicializar la colección de estacionamientos
  // async initializeParkingCollection() {
  //   try {
  //     const db = getFirestore();
  //     const batch = writeBatch(db);

  //     for (let i = 1; i <= 200; i++) {
  //       const docRef = doc(db, `estacionamientos/${i}`);
  //       const data: Estacionamiento = {
  //         id: i,
  //         estado: true,
  //         nombre: '',
  //         patente: '',
  //         departamento: '',
  //         tipoReserva: '',
  //       };

  //       batch.set(docRef, data);
  //     }

  //     await batch.commit();
  //   } catch (error) {
  //     console.error('Error al inicializar la colección:', error);
  //   }
  // }

  async getAllParking(): Promise<Estacionamiento[]> {
    const colRef = collection(getFirestore(), 'estacionamientos');
    const querySnapshot = await getDocs(colRef);
    return querySnapshot.docs.map((doc) => ({
      id: parseInt(doc.id, 10),
      estado: doc.data()['estado'],
      nombre: doc.data()['nombre'],
      patente: doc.data()['patente'],
      departamento: doc.data()['departamento'],
      tipoReserva: doc.data()['tipoReserva'],
    })) as Estacionamiento[];
  }

  // **** GESTIÓN DE PISCINA ****

  async getPoolDocument(path: string) {
    const docSnap = await getDoc(doc(getFirestore(), path));
    return docSnap.exists() ? docSnap.data() : null;
  }

  async addPoolDocument(collectionName: string, docId: string, data: any) {
    return setDoc(doc(getFirestore(), `${collectionName}/${docId}`), data);
  }

  async updatePoolDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  async deletePoolDocument(path: string) {
    return updateDoc(doc(getFirestore(), path), { deleted: true });
  }

  // Nuevo método para verificar duplicados en registros de piscina
  async hasDuplicateInPool(field: string, value: string): Promise<boolean> {
    const colRef = collection(getFirestore(), 'piscina');
    const q = query(colRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Nuevo método para contar pulseras por color
  async countBraceletsByColor(): Promise<Record<string, number>> {
    try {
      const db = getFirestore();
      const colRef = collection(db, 'piscina');
      const querySnapshot = await getDocs(colRef);

      // Inicializamos el contador de colores
      const colorCounts: Record<string, number> = { Verde: 0, Calipso: 0 };

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data['residentes'] && Array.isArray(data['residentes'])) {
          console.log('Residentes:', data['residentes']);  // Verifica los datos de residentes
          colorCounts['Verde'] += data['residentes'].length;  // Suma la cantidad de residentes
        } else {
          console.warn('No se encontraron residentes o no es un array válido:', data['residentes']);
        }

        if (data['visitas'] && Array.isArray(data['visitas'])) {
          console.log('Visitas:', data['visitas']);  // Verifica los datos de visitas
          colorCounts['Calipso'] += data['visitas'].length;  // Suma la cantidad de visitas
        } else {
          console.warn('No se encontraron visitas o no es un array válido:', data['visitas']);
        }

        console.log('Conteo de colores:', colorCounts);  // Verifica el resultado final
      });

      return colorCounts;
    } catch (error) {
      console.error('Error al contar las pulseras:', error);
      throw error;
    }
  }


// Actualizamos el método para obtener datos de piscina con el manejo de visitas
async getPoolData(): Promise<{ data: any[], braceletCounts?: Record<string, number> }> {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'piscina');
    const querySnapshot = await getDocs(colRef);

    const data: any[] = querySnapshot.docs.map((doc) => doc.data());

    // Si no hay visitas, no retornamos los conteos
    if (data.length === 0) {
      return { data };
    }

    // Contamos las pulseras por color
    const braceletCounts = await this.countBraceletsByColor();

    return { data, braceletCounts };
  } catch (error) {
    console.error('Error al obtener datos de piscina:', error);
    throw error;
  }
}


  // **** GESTIÓN DE ENCOMIENDAS ****

  async getDeliveryDocument(path: string) {
    const docSnap = await getDoc(doc(getFirestore(), path));
    return docSnap.exists() ? docSnap.data() : null;
  }

  async addDeliveryDocument(collectionName: string, docId: string, data: any) {
    return setDoc(doc(getFirestore(), `${collectionName}/${docId}`), data);
  }

  async updateDeliveryDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  async deleteDeliveryDocument(path: string) {
    return updateDoc(doc(getFirestore(), path), { deleted: true });
  }

  // **** ALMACENAMIENTO ****

  async uploadImage(path: string, dataUrl: string): Promise<string> {
    try {
      const storageRef = ref(getStorage(), path);
      await uploadString(storageRef, dataUrl, 'data_url');
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}
