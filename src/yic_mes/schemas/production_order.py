from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductionOrderCreate(BaseModel):
    order_no: str = Field(max_length=50)
    product_name: str = Field(max_length=200)
    qty_plan: float = Field(gt=0)


class ProductionOrderUpdate(BaseModel):
    product_name: str | None = Field(default=None, max_length=200)
    qty_plan: float | None = Field(default=None, gt=0)
    status: str | None = None


class ProductionOrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_no: str
    product_name: str
    qty_plan: float
    qty_actual: float
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: str | None
    updated_by: str | None


class ProductionOrderFilter(BaseModel):
    status: str | None = None
    product_name: str | None = None
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)
