from datetime import datetime
from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from yic_mes.core.base_model import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseRepository(Generic[T]):
    """제네릭 CRUD 리포지토리. 도메인 리포지토리가 상속한다."""

    def __init__(self, session: AsyncSession, model_class: type[T]):
        self.session = session
        self.model_class = model_class

    async def get_by_id(self, id: int) -> T | None:
        stmt = select(self.model_class).where(
            self.model_class.id == id,
            self.model_class.is_deleted == False,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_list(self, skip: int = 0, limit: int = 20, **filters) -> list[T]:
        stmt = select(self.model_class).where(self.model_class.is_deleted == False)
        for key, value in filters.items():
            if value is not None and hasattr(self.model_class, key):
                stmt = stmt.where(getattr(self.model_class, key) == value)
        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(self, **filters) -> int:
        stmt = select(func.count(self.model_class.id)).where(
            self.model_class.is_deleted == False
        )
        for key, value in filters.items():
            if value is not None and hasattr(self.model_class, key):
                stmt = stmt.where(getattr(self.model_class, key) == value)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def create(self, obj: T) -> T:
        self.session.add(obj)
        await self.session.flush()
        return obj

    async def update(self, id: int, data: dict) -> T | None:
        obj = await self.get_by_id(id)
        if not obj:
            return None
        for key, value in data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        await self.session.flush()
        return obj

    async def soft_delete(self, id: int) -> bool:
        obj = await self.get_by_id(id)
        if not obj:
            return False
        obj.is_deleted = True
        obj.deleted_at = datetime.utcnow()
        await self.session.flush()
        return True
