from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from yic_mes.core.base_model import BaseModel


class ProductionOrder(BaseModel):
    """생산 오더 — MES 핵심 도메인. 제품 생산 계획 단위."""

    __tablename__ = "production_orders"

    order_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    product_name: Mapped[str] = mapped_column(String(200))
    qty_plan: Mapped[float] = mapped_column(Numeric(18, 4))
    qty_actual: Mapped[float] = mapped_column(Numeric(18, 4), default=0)
    status: Mapped[str] = mapped_column(String(20), default="planned")
    # status: planned → in_progress → completed / cancelled

    work_orders: Mapped[list["WorkOrder"]] = relationship(back_populates="production_order")
