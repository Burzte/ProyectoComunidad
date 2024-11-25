import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  items = [

    {
      title: 'Estacionamiento',
      subtitle: 'Solicita estacionamiento',
      content: '',
      route: '/main/parking',
      imageUrl: 'assets/img/estacionamiento.jpg', // Ruta relativa a la carpeta de assets
    },
    {
      title: 'Piscina',
      subtitle: 'Retira tus pulseras',
      content: '',
      route: '/main/pool',
      imageUrl: 'assets/img/piscina.jpeg', // Ruta relativa a la carpeta de assets
    },
    {
      title: 'Encomiendas',
      subtitle: 'Revisa si ha llegado tu encomienda',
      content: '',
      route: '/main/delivery',
      imageUrl: 'assets/img/encomiendas.jpg', // Ruta relativa a la carpeta de assets
    },
  ];

  ngOnInit() {}

  signOut(){
    this.firebaseSvc.signOut();
  }

}
