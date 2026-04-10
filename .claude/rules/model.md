---
globs: src/yic_mes/models/**/*.py
description: Model 파일 작성/수정 시 자동 참조되는 규칙
---

# Model 레이어 규칙

> 적용 대상: `src/yic_mes/models/*.py`
> 참고 파일: `src/yic_mes/core/base_model.py` (BaseModel 정의)

## 요약
SQLAlchemy 2.0 Declarative 스타일로 DB 테이블을 정의한다.
모든 모델은 `BaseModel`을 상속하며, 감사 필드와 soft delete를 자동으로 갖는다.

## 규칙

### 1. 클래스 정의
- `BaseModel`(프로젝트 공통 베이스)을 상속한다.
- `__tablename__`을 명시적으로 선언한다 (snake_case, 복수형).
- 파일명 = 도메인명 (예: `production_order.py`), 클래스명 = PascalCase 단수형.

### 2. 컬럼 규칙
- PK: `id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)`
- FK: `{참조테이블}_id` 네이밍. `ForeignKey("테이블명.id")` 사용.
- 상태 필드: `status: Mapped[str]` — Enum 문자열 사용, DB에는 VARCHAR 저장.
- 날짜: `datetime` 타입, timezone-aware. 기본값은 서버 시간(`func.now()`).
- 수량/금액: `Numeric(precision=18, scale=4)` 사용.

### 3. 감사 필드 (BaseModel에서 상속)
```python
created_at: Mapped[datetime]    # 생성 시각, 자동
updated_at: Mapped[datetime]    # 수정 시각, 자동
created_by: Mapped[str | None]  # 생성자
updated_by: Mapped[str | None]  # 수정자
is_deleted: Mapped[bool]        # soft delete 플래그
deleted_at: Mapped[datetime | None]
```

### 4. 관계(Relationship)
- `relationship()`은 모델 파일 내에 정의한다.
- `back_populates`를 양쪽 모두에 명시한다.
- lazy 로딩 기본. 필요 시 `selectinload`를 repository에서 지정.

### 5. 인덱스/제약
- 자주 조회되는 컬럼에 `index=True` 추가.
- 유니크 제약은 `UniqueConstraint`로 테이블 레벨에 선언.
- 복합 인덱스는 `__table_args__`에 정의.

### 6. 예시 구조
```python
from sqlalchemy import String, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from yic_mes.core.base_model import BaseModel


class ProductionOrder(BaseModel):
    __tablename__ = "production_orders"

    order_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    qty_plan: Mapped[float] = mapped_column(Numeric(18, 4))
    qty_actual: Mapped[float] = mapped_column(Numeric(18, 4), default=0)
    status: Mapped[str] = mapped_column(String(20), default="planned")

    product: Mapped["Product"] = relationship(back_populates="production_orders")
    work_orders: Mapped[list["WorkOrder"]] = relationship(back_populates="production_order")
```
