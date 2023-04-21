import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrderModel } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  getIdOrderMontacarga(id: string): Observable<IOrderModel> {
    return this.http.get<IOrderModel>(`${this.url}/api/order/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }

  addAddress(address: IOrderModel): Observable<IOrderModel> {
    return this.http.post<IOrderModel>(`${this.url}/api/order/`, address, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateAddress(address: IOrderModel, addressId: number): Observable<IOrderModel> {
    return this.http.put<IOrderModel>(`${this.url}/api/order/${addressId}`, address, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
