---
globs: src/yic_mes/services/**/*.py
description: Service 파일 작성/수정 시 자동 참조되는 규칙
---

# Service 레이어 규칙

> 적용 대상: `src/yic_mes/services/*.py`
> 참고 파일: 해당 도메인의 repository, schema

## 요약
비즈니스 로직을 처리하는 계층.
Repository를 통해 데이터에 접근하고, 트랜잭션 경계를 관리한다.
Controller에서 직접 Repository를 호출하지 않도록 중간 역할을 한다.

## 규칙

### 1. 파일/클래스 네이밍
- 파일명: `{도메인}.py`
- 클래스명: `{Domain}Service`

### 2. 의존성 주입
- Repository를 생성자에서 주입받는다.
- 다른 Service도 필요 시 생성자에서 주입 (순환 참조 주의).

### 3. 트랜잭션 관리
- Service 메서드가 트랜잭션의 단위이다.
- 메서드 내에서 `session.commit()` 호출.
- 에러 발생 시 `session.rollback()` 처리 (또는 컨텍스트 매니저 활용).

### 4. 비즈니스 규칙
- 유효성 검증(존재 여부, 상태 전이 가능 여부 등)은 Service에서 수행.
- 에러 발생 시 `src/yic_mes/core/exceptions.py`의 커스텀 예외를 raise.
- 상태 전이 로직: 허용되는 전이만 명시적으로 정의.

### 5. 메서드 네이밍
- `create_{도메인}` — 생성
- `update_{도메인}` — 수정
- `delete_{도메인}` — 삭제 (soft delete)
- `get_{도메인}` — 단건 조회
- `get_{도메인}_list` — 목록 조회
- 도메인 액션: `start_production`, `complete_work_order` 등 동사형.

### 6. 예시 구조
```python
from yic_mes.core.exceptions import NotFoundError, BusinessError
from yic_mes.repositories.production_order import ProductionOrderRepository
from yic_mes.schemas.production_order import ProductionOrderCreate


class ProductionOrderService:
    def __init__(self, repo: ProductionOrderRepository):
        self.repo = repo

    async def create_production_order(self, data: ProductionOrderCreate) -> ProductionOrder:
        existing = await self.repo.get_by_order_no(data.order_no)
        if existing:
            raise BusinessError(f"Order {data.order_no} already exists")

        order = ProductionOrder(**data.model_dump())
        return await self.repo.create(order)

    async def start_production(self, order_id: int) -> ProductionOrder:
        order = await self.repo.get_by_id(order_id)
        if not order:
            raise NotFoundError("ProductionOrder", order_id)
        if order.status != "planned":
            raise BusinessError(f"Cannot start order in '{order.status}' status")

        return await self.repo.update(order_id, {"status": "in_progress"})
```
