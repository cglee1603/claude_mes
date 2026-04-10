export interface ProductionOrder {
  id: number;
  order_no: string;
  product_name: string;
  qty_plan: number;
  qty_actual: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface ProductionOrderCreate {
  order_no: string;
  product_name: string;
  qty_plan: number;
}

export interface ProductionOrderUpdate {
  product_name?: string;
  qty_plan?: number;
  status?: string;
}

export interface ProductionOrderFilter {
  status?: string;
  product_name?: string;
  page: number;
  size: number;
}
