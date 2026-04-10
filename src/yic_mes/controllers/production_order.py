from fastapi import APIRouter, Depends, status

from yic_mes.core.dependencies import get_production_order_service
from yic_mes.schemas.common import ApiResponse, PaginatedResponse
from yic_mes.schemas.production_order import (
    ProductionOrderCreate,
    ProductionOrderFilter,
    ProductionOrderRead,
    ProductionOrderUpdate,
)
from yic_mes.services.production_order import ProductionOrderService

router = APIRouter(prefix="/production-orders", tags=["production-order"])


@router.get("/", response_model=ApiResponse[PaginatedResponse[ProductionOrderRead]])
async def get_production_order_list(
    filters: ProductionOrderFilter = Depends(),
    service: ProductionOrderService = Depends(get_production_order_service),
):
    items, total = await service.get_production_order_list(filters)
    return ApiResponse(
        data=PaginatedResponse(items=items, total=total, page=filters.page, size=filters.size)
    )


@router.get("/{order_id}", response_model=ApiResponse[ProductionOrderRead])
async def get_production_order(
    order_id: int,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.get_production_order(order_id)
    return ApiResponse(data=order)


@router.post(
    "/",
    response_model=ApiResponse[ProductionOrderRead],
    status_code=status.HTTP_201_CREATED,
)
async def create_production_order(
    data: ProductionOrderCreate,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.create_production_order(data)
    return ApiResponse(data=order)


@router.patch("/{order_id}", response_model=ApiResponse[ProductionOrderRead])
async def update_production_order(
    order_id: int,
    data: ProductionOrderUpdate,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.update_production_order(order_id, data)
    return ApiResponse(data=order)


@router.delete("/{order_id}", response_model=ApiResponse[bool])
async def delete_production_order(
    order_id: int,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    result = await service.delete_production_order(order_id)
    return ApiResponse(data=result)


@router.post("/{order_id}/start", response_model=ApiResponse[ProductionOrderRead])
async def start_production(
    order_id: int,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.start_production(order_id)
    return ApiResponse(data=order)


@router.post("/{order_id}/complete", response_model=ApiResponse[ProductionOrderRead])
async def complete_production(
    order_id: int,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.complete_production(order_id)
    return ApiResponse(data=order)
