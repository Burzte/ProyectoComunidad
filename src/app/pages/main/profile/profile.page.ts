import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditProfileComponent } from '../../../shared/components/edit-profile/edit-profile.component';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //** TOMAR O SELECCIONAR UNA IMAGEN **
  async takeImage() {
    const user = this.user();
    if (!user || !user.uid) {
      this.utilsSvc.presentToast({
        message: 'Error: Usuario no autenticado',
        duration: 3000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    const path = `users/${user.uid}`;
    const loading = await this.utilsSvc.loading();

    try {
      // Tomar o seleccionar imagen usando la función modificada del servicio
      const imageResult = await this.utilsSvc.takePicture();

      // Si el usuario cancela, se sale sin hacer nada
      if (!imageResult) {
        console.log('El usuario canceló la acción');
        return; // Sale si no se seleccionó una imagen
      }

      // Si se selecciona o toma una foto, subimos la imagen
      const uploadedImageUrl = await this.firebaseSvc.uploadImage(
        `${user.uid}/profile`,
        imageResult.dataUrl
      );

      user.image = uploadedImageUrl;
      await this.firebaseSvc.updateDocument(path, { image: user.image });
      this.utilsSvc.saveInLocalStorage('user', user);

      await loading.present();

      this.utilsSvc.presentToast({
        message: 'Imagen de Perfil actualizada',
        duration: 3000,
        color: 'tertiary',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });

    } catch (error) {
      console.error(error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar la imagen de Perfil',
        duration: 3000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      // Aseguramos que el loading se cierre sin importar si se completó la operación o se canceló
      loading.dismiss();
    }
  }

   // Método para abrir el popover
   async openEditProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        user: this.user(), // Pasar el usuario actual como propiedad
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.updatedUser) {
      // Si se actualizaron los datos del usuario, actualizar en el almacenamiento local
      this.utilsSvc.saveInLocalStorage('user', data.updatedUser);
    }
  }

}
