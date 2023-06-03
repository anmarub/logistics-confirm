import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrderDetailsModel } from '../model/orderDetails.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  addOrderDetails(order_detail: IOrderDetailsModel): Observable<IOrderDetailsModel> {
    return this.http.post<IOrderDetailsModel>(`${this.url}/api/order-detail`, order_detail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }

  addOrderDetailsArray(order_detail: IOrderDetailsModel[]): Observable<IOrderDetailsModel> {
    return this.http.post<IOrderDetailsModel>(`${this.url}/api/order-detail-array`, order_detail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }
}
