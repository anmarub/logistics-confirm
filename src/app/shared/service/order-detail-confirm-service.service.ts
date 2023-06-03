import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrderDetailsConfirmModel } from '../model/orderDetailsConfirm.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailConfirmServiceService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  addOrderDetailsConfirm(order_confirm: IOrderDetailsConfirmModel): Observable<IOrderDetailsConfirmModel> {
    return this.http.post<IOrderDetailsConfirmModel>(`${this.url}/api/order-detail-confirm`, order_confirm, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }

  addOrderConfirmArray(order_confirm: IOrderDetailsConfirmModel[]): Observable<IOrderDetailsConfirmModel> {
    return this.http.post<IOrderDetailsConfirmModel>(`${this.url}/api/order-confirm-array`, order_confirm, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }
}
