import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  @Input() user: User; // Usuario recibido como parámetro

  updatedUser: User;

  constructor(
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.updatedUser = { ...this.user };
  }

  usuario(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async saveChanges() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const path = `users/${this.updatedUser.uid}`;
      await this.firebaseSvc.updateDocument(path, this.updatedUser);

      this.modalCtrl.dismiss({ updatedUser: this.updatedUser });

      this.utilsSvc.presentToast({
        message: 'Perfil actualizado con éxito',
        duration: 3000,
        color: 'tertiary',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);

      this.utilsSvc.presentToast({
        message: 'Error al actualizar el perfil',
        duration: 3000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }
}
