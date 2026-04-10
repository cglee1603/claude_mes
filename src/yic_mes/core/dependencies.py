from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from yic_mes.core.database import get_session
from yic_mes.repositories.production_order import ProductionOrderRepository
from yic_mes.services.production_order import ProductionOrderService


async def get_production_order_service(
    session: AsyncSession = Depends(get_session),
) -> ProductionOrderService:
    repo = ProductionOrderRepository(session)
    return ProductionOrderService(repo)
