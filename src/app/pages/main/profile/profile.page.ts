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
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);


  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //** TOMAR O SELECCIONAR UNA IMAGEN **
  async takeImage(){

    let user = this.user();
    let path = `users/${user.uid}`

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {
      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen de Perfil actualizada',
        duration: 3000,
        color: 'tertiary',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: 'Error al actualizar la imagen de Perfil',
        duration: 3000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
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
