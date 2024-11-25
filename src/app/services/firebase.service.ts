import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, updateDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // **AUTENTICACIÓN**

  getAuth() {
    return getAuth();
  }

  // **ACCEDER**
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // **CREAR USUARIO**
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // **ACTUALIZAR USUARIO**
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // **RECUPERAR CONTRASEÑA**
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // **CERRAR SESIÓN**
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // ****BASE DE DATOS**

 // **OBTENER USUARIO POR UID**
 async getUserRole(uid: string) {
  const db = getFirestore(); // Obtener referencia a Firestore
  const userRef = doc(db, `usuarios/${uid}`); // Crear referencia al documento del usuario
  const userSnap = await getDoc(userRef); // Obtener el snapshot del documento

  if (userSnap.exists()) {
    return userSnap.data()['role']; // Acceder de manera segura a la propiedad 'rol' con corchetes
  } else {
    console.log("No such document!");
    return null;
  }
}

  // **SETEAR UN DOCUMENTO**
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // **OBTENER UN DOCUMENTO**
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // **AGREGAR UN DOCUMENTO**
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // **ACTUALIZAR UN DOCUMENTO**
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // ****ALMACENAMIENTO**

  // **SUBIR IMAGEN**
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(),path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

}
