---
globs: src/yic_mes/repositories/**/*.py
description: Repository 파일 작성/수정 시 자동 참조되는 규칙
---

# Repository 레이어 규칙

> 적용 대상: `src/yic_mes/repositories/*.py`
> 참고 파일: `src/yic_mes/core/base_repository.py` (BaseRepository)

## 요약
데이터베이스 CRUD를 담당하는 계층.
SQLAlchemy async session을 사용하며, BaseRepository의 공통 메서드를 상속한다.
비즈니스 로직은 포함하지 않는다.

## 규칙

### 1. 파일/클래스 네이밍
- 파일명: `{도메인}.py` (예: `production_order.py`)
- 클래스명: `{Domain}Repository` (예: `ProductionOrderRepository`)

### 2. BaseRepository 공통 메서드
```python
class BaseRepository[T]:
    async def get_by_id(id: int) -> T | None
    async def get_list(skip: int, limit: int, **filters) -> list[T]
    async def count(**filters) -> int
    async def create(obj: T) -> T
    async def update(id: int, data: dict) -> T | None
    async def soft_delete(id: int) -> bool
```

### 3. 커스텀 쿼리
- 도메인 전용 조회가 필요하면 Repository에 메서드를 추가한다.
- 메서드명: `get_by_{조건}`, `find_{복수형}_by_{조건}` 패턴.
- 복잡한 조인은 `select()` + `options(selectinload(...))` 사용.
- 항상 `is_deleted == False` 조건을 기본 포함한다.

### 4. 세션 관리
- `AsyncSession`을 생성자 파라미터로 주입받는다.
- Repository에서 `commit()`하지 않는다 — Service 레이어에서 트랜잭션을 관리.
- `flush()`는 허용 (ID 반환이 필요할 때).

### 5. 예시 구조
```python
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
```
