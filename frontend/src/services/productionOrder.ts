import { apiFetch } from "./api";
import type { PaginatedResponse } from "../types/common";
import type {
  ProductionOrder,
  ProductionOrderCreate,
  ProductionOrderFilter,
  ProductionOrderUpdate,
} from "../types/productionOrder";

const PATH = "/production-orders";

export function getProductionOrders(
  params: ProductionOrderFilter
): Promise<PaginatedResponse<ProductionOrder>> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.product_name) query.set("product_name", params.product_name);
  query.set("page", String(params.page));
  query.set("size", String(params.size));
  return apiFetch(`${PATH}/?${query}`);
}

export function getProductionOrder(id: number): Promise<ProductionOrder> {
  return apiFetch(`${PATH}/${id}`);
}

export function createProductionOrder(data: ProductionOrderCreate): Promise<ProductionOrder> {
  return apiFetch(PATH + "/", { method: "POST", body: JSON.stringify(data) });
}

export function updateProductionOrder(
  id: number,
  data: ProductionOrderUpdate
): Promise<ProductionOrder> {
  return apiFetch(`${PATH}/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteProductionOrder(id: number): Promise<boolean> {
  return apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}
