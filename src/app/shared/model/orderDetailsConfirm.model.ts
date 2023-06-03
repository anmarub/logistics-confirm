export interface IOrderDetailsConfirmModel {
  id_confirm?: number,
  order_id:number,
  code_cil_confirm: string,
  type_cil_confirm: string,
  qty_cil_confirm: number,
  tara_cil_confirm: number,
  kg_cil_confirm: number,
  type_move: boolean
}


export interface IAccGroupConfirm {
  [key: string]: {
    type_cil_confirm: string;
    qty_cil_confirm: number;
    kg_cil_confirm: number;
  };
}

export interface ITotalAmountRef {
  type_cil_confirm: string;
  qty_cil_confirm: number;
  kg_cil_confirm: number;
}
