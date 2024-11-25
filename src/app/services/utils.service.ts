import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  // **LOADING**
  loading(){
    return this.loadingCtrl.create({ spinner: 'bubbles'})
  }

  // **TOAST**
  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts)
    toast.present();
  }

  // **ENRUTA A CUALQUIER PÁGINA DISPONIBLE**
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  // **GUARDAR UN ELEMENTO EN LOCALSTORAGE**
  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // **OBTIENE UN ELEMENTO DESDE LOCALSTORAGE**
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }

  // **MODAL**
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async takePicture(promptLabelHeader: string){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar una imagen',
      promptLabelPicture: 'Tomar una foto',
    });
  }

}
