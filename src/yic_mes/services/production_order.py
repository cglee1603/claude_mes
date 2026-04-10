from yic_mes.core.exceptions import BusinessError, DuplicateError, NotFoundError
from yic_mes.models.production_order import ProductionOrder
from yic_mes.repositories.production_order import ProductionOrderRepository
from yic_mes.schemas.production_order import (
    ProductionOrderCreate,
    ProductionOrderFilter,
    ProductionOrderUpdate,
)

_ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "planned": {"in_progress", "cancelled"},
    "in_progress": {"completed", "cancelled"},
    "completed": set(),
    "cancelled": set(),
}


class ProductionOrderService:
    def __init__(self, repo: ProductionOrderRepository):
        self.repo = repo

    async def create_production_order(self, data: ProductionOrderCreate) -> ProductionOrder:
        existing = await self.repo.get_by_order_no(data.order_no)
        if existing:
            raise DuplicateError("ProductionOrder", "order_no", data.order_no)
        order = ProductionOrder(**data.model_dump())
        return await self.repo.create(order)

    async def get_production_order(self, order_id: int) -> ProductionOrder:
        order = await self.repo.get_by_id(order_id)
        if not order:
            raise NotFoundError("ProductionOrder", order_id)
        return order

    async def get_production_order_list(
        self, filters: ProductionOrderFilter
    ) -> tuple[list[ProductionOrder], int]:
        skip = (filters.page - 1) * filters.size
        filter_kwargs = {}
        if filters.status:
            filter_kwargs["status"] = filters.status
        items = await self.repo.get_list(skip=skip, limit=filters.size, **filter_kwargs)
        total = await self.repo.count(**filter_kwargs)
        return items, total

    async def update_production_order(
        self, order_id: int, data: ProductionOrderUpdate
    ) -> ProductionOrder:
        order = await self.repo.get_by_id(order_id)
        if not order:
            raise NotFoundError("ProductionOrder", order_id)
        update_data = data.model_dump(exclude_unset=True)
        if "status" in update_data:
            self._validate_transition(order.status, update_data["status"])
        updated = await self.repo.update(order_id, update_data)
        return updated

    async def delete_production_order(self, order_id: int) -> bool:
        order = await self.repo.get_by_id(order_id)
        if not order:
            raise NotFoundError("ProductionOrder", order_id)
        return await self.repo.soft_delete(order_id)

    async def start_production(self, order_id: int) -> ProductionOrder:
        order = await self.get_production_order(order_id)
        self._validate_transition(order.status, "in_progress")
        return await self.repo.update(order_id, {"status": "in_progress"})

    async def complete_production(self, order_id: int) -> ProductionOrder:
        order = await self.get_production_order(order_id)
        self._validate_transition(order.status, "completed")
        return await self.repo.update(order_id, {"status": "completed"})

    def _validate_transition(self, current: str, target: str) -> None:
        allowed = _ALLOWED_TRANSITIONS.get(current, set())
        if target not in allowed:
            raise BusinessError(
                f"Cannot transition from '{current}' to '{target}'"
            )
