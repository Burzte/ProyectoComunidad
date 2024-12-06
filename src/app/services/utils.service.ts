import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  constructor(private actionSheetCtrl: ActionSheetController) {}

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

  async takePicture(): Promise<{ dataUrl: string } | null> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de Imagen',
      buttons: [
        { text: 'Tomar Foto',
          icon: 'camera',
          handler: async () => {
            const image = await this.captureImage(CameraSource.Camera);
            actionSheet.dismiss(image); // Devuelve la imagen
            },
          },
          {
            text: 'Seleccionar de la Galería',
            icon: 'image',
            handler: async () => {
              const image = await this.captureImage(CameraSource.Photos);
              actionSheet.dismiss(image); // Devuelve la imagen
              },
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              icon: 'close',
              handler: () => {
                console.log('Acción cancelada');
              },
            },
          ],
        });
        await actionSheet.present();
        const result = await actionSheet.onDidDismiss();
        return result.data || null; // Devuelve la imagen seleccionada o null si se canceló
        }

        private async captureImage(source: CameraSource): Promise<{ dataUrl: string }> {
           const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            source,
          }); return { dataUrl: image.dataUrl };
        }

}
