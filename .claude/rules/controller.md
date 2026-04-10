---
globs: src/yic_mes/controllers/**/*.py
description: Controller 파일 작성/수정 시 자동 참조되는 규칙
---

# Controller 레이어 규칙

> 적용 대상: `src/yic_mes/controllers/*.py`
> 참고 파일: 해당 도메인의 service, schema, `schemas/common.py`

## 요약
FastAPI 라우터로 HTTP 엔드포인트를 정의한다.
요청을 Schema로 변환하고 Service에 위임한 뒤 응답을 반환한다.
비즈니스 로직이나 DB 접근을 직접 수행하지 않는다.

## 규칙

### 1. 파일/라우터 네이밍
- 파일명: `{도메인}.py`
- 라우터 변수: `router = APIRouter(prefix="/{도메인s}", tags=["{도메인}"])`
- URL은 복수형, kebab-case 허용 (예: `/production-orders`, `/work-orders`)

### 2. 엔드포인트 패턴
| 동작 | HTTP | URL | 함수명 |
|------|------|-----|--------|
| 목록 조회 | GET | `/` | `get_{도메인}_list` |
| 단건 조회 | GET | `/{id}` | `get_{도메인}` |
| 생성 | POST | `/` | `create_{도메인}` |
| 수정 | PATCH | `/{id}` | `update_{도메인}` |
| 삭제 | DELETE | `/{id}` | `delete_{도메인}` |
| 커스텀 액션 | POST | `/{id}/{action}` | `{action}_{도메인}` |

### 3. 의존성 주입
- FastAPI `Depends`로 Service를 주입한다.
- DB 세션: `Depends(get_session)` → Repository → Service 순으로 조립.
- 인증: `Depends(get_current_user)` 사용.

### 4. 응답 형식
- 모든 응답은 `ApiResponse[T]`로 래핑한다.
- 목록은 `ApiResponse[PaginatedResponse[T]]` 사용.
- 상태 코드: 생성=201, 삭제=200, 조회/수정=200.

### 5. 에러 처리
- Service에서 raise한 예외는 전역 exception handler가 처리.
- Controller에서 try/except를 직접 작성하지 않는다.

### 6. 예시 구조
```python
from fastapi import APIRouter, Depends, status
from yic_mes.schemas.common import ApiResponse, PaginatedResponse
from yic_mes.schemas.production_order import (
    ProductionOrderCreate, ProductionOrderRead, ProductionOrderFilter,
)
from yic_mes.services.production_order import ProductionOrderService
from yic_mes.core.dependencies import get_production_order_service

router = APIRouter(prefix="/production-orders", tags=["production-order"])


@router.get("/", response_model=ApiResponse[PaginatedResponse[ProductionOrderRead]])
async def get_production_order_list(
    filters: ProductionOrderFilter = Depends(),
    service: ProductionOrderService = Depends(get_production_order_service),
):
    items, total = await service.get_production_order_list(filters)
    return ApiResponse(data=PaginatedResponse(items=items, total=total, page=filters.page, size=filters.size))


@router.post("/", response_model=ApiResponse[ProductionOrderRead], status_code=status.HTTP_201_CREATED)
async def create_production_order(
    data: ProductionOrderCreate,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.create_production_order(data)
    return ApiResponse(data=order)


@router.post("/{order_id}/start", response_model=ApiResponse[ProductionOrderRead])
async def start_production(
    order_id: int,
    service: ProductionOrderService = Depends(get_production_order_service),
):
    order = await service.start_production(order_id)
    return ApiResponse(data=order)
```
