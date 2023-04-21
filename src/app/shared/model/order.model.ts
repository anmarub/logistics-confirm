import { IOrderDetailsModel } from "./orderDetails.model"

export interface IOrderModel {
  id_order?: number,
  id_order_SF: string,
  id_order_WL: string,
  customer_code: string,
  customer_name: string,
  comment_confirm?: string,
  orderDetail?: IOrderDetailsModel[]
}
