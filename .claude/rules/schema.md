---
globs: src/yic_mes/schemas/**/*.py
description: Schema(DTO) 파일 작성/수정 시 자동 참조되는 규칙
---

# Schema(DTO) 레이어 규칙

> 적용 대상: `src/yic_mes/schemas/*.py`
> 참고 파일: `src/yic_mes/schemas/common.py` (ApiResponse, PaginatedResponse)

## 요약
Pydantic v2 모델로 API 요청/응답 데이터를 정의한다.
ORM 모델과 분리하여 외부 노출 데이터를 통제한다.

## 규칙

### 1. 파일/클래스 네이밍
- 파일명: 도메인명 (예: `production_order.py`)
- 클래스명 접미사 규칙:
  - `{Domain}Create` — 생성 요청
  - `{Domain}Update` — 수정 요청 (모든 필드 Optional)
  - `{Domain}Read` — 응답 (id, 감사필드 포함)
  - `{Domain}Filter` — 목록 조회 필터 (Optional 필드)

### 2. 필드 규칙
- `model_config = ConfigDict(from_attributes=True)` 설정하여 ORM 변환 지원.
- 필수/선택 구분 명확히. Update 스키마는 전부 `Optional`.
- `Field()`로 validation 추가: `min_length`, `max_length`, `ge`, `le` 등.
- 날짜 필드: `datetime` 타입 사용.
- Enum 값은 `Literal["planned", "in_progress", "completed"]` 또는 `StrEnum` 사용.

### 3. 공통 스키마 (common.py)
```python
class ApiResponse[T](BaseModel):
    success: bool = True
    data: T | None = None
    message: str = ""

class PaginatedResponse[T](BaseModel):
    items: list[T]
    total: int
    page: int
    size: int
```

### 4. 예시 구조
```python
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ProductionOrderCreate(BaseModel):
    order_no: str = Field(max_length=50)
    product_id: int
    qty_plan: float = Field(gt=0)


class ProductionOrderUpdate(BaseModel):
    qty_plan: float | None = Field(default=None, gt=0)
    status: str | None = None


class ProductionOrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_no: str
    product_id: int
    qty_plan: float
    qty_actual: float
    status: str
    created_at: datetime
    updated_at: datetime
```
