from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from yic_mes.core.base_repository import BaseRepository
from yic_mes.models.production_order import ProductionOrder


class ProductionOrderRepository(BaseRepository[ProductionOrder]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, ProductionOrder)

    async def get_by_order_no(self, order_no: str) -> ProductionOrder | None:
        stmt = select(ProductionOrder).where(
            ProductionOrder.order_no == order_no,
            ProductionOrder.is_deleted == False,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def find_by_status(self, status: str) -> list[ProductionOrder]:
        stmt = select(ProductionOrder).where(
            ProductionOrder.status == status,
            ProductionOrder.is_deleted == False,
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
