import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PoolFormModalComponent } from '../../../shared/components/pool-form-modal/pool-form-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.page.html',
  styleUrls: ['./pool.page.scss'],
})
export class PoolPage implements OnInit {
  registros: any[] = [];
  role: string | null = null;
  poolData: any[] = []; // Contendrá los datos de la piscina
  braceletColors: string[] = []; // Lista de colores para las pulseras
  braceletCounts: Record<string, number> = {}; // Conteo de pulseras por color

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.getUserRole();
    this.cargarRegistros();
    this.loadPoolData()
  }

  async getUserRole() {
    const user = getAuth().currentUser;
    if (user) {
      const userDoc = await this.firebaseService.getDocument(`users/${user.uid}`);
      this.role = userDoc?.['role'] || null;
    }
  }

  isResidente(): boolean {
    return this.role === 'Residente';
  }

  isConserje(): boolean {
    return this.role === 'Conserje';
  }

  async abrirModal() {
    if (!this.isConserje()) {
      await this.mostrarAlerta('Acceso Restringido', 'Solo los conserjes pueden registrar accesos.');
      return;
    }

    const modal = await this.modalController.create({
      component: PoolFormModalComponent,
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        console.log('Datos recibidos desde el modal:', data.data);  // Aquí debería aparecer el departamento con su valor
        await this.registrarAcceso(data.data);
      }
    });

    return modal.present();
  }

  async registrarAcceso(nuevoRegistro: any) {
    // Asegúrate de que 'departamento' tenga un valor antes de guardarlo
    console.log('Registro a guardar:', nuevoRegistro);

    try {
      const timestamp = new Date().toISOString();
      const registroConDatos = {
        ...nuevoRegistro,
        timestamp,
        pulseras: {
          verde: nuevoRegistro.residentes.length,
          calipso: nuevoRegistro.visitas.length,
        },
        departamento: nuevoRegistro.departamento || '',  // Si el departamento está vacío, lo dejamos como está
      };

      // Guardar en Firebase
      await this.firebaseService.addDocument('piscina', registroConDatos);
      this.mostrarAlerta('Éxito', 'El acceso fue registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar acceso:', error);
      this.mostrarAlerta('Error', 'Hubo un problema al registrar el acceso.');
    }
  }



  cargarRegistros() {
    this.firebaseService.getCollection('piscina').subscribe((data) => {
      this.registros = data.map((registro) => ({
        ...registro,
        pulseras: registro.pulseras || { verde: 0, calipso: 0 },
        departamento: registro.departamento,
      }));
    });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async loadPoolData() {
    try {
      // Llamamos al método para contar las pulseras por color
      this.braceletCounts = await this.firebaseService.countBraceletsByColor();
      this.braceletColors = Object.keys(this.braceletCounts); // Verde y Calipso
    } catch (error) {
      console.error('Error al cargar los datos de la piscina:', error);
    }
  }
}
