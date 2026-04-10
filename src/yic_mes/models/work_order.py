from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from yic_mes.core.base_model import BaseModel


class WorkOrder(BaseModel):
    """작업 지시 — 생산 오더를 실행하기 위한 개별 작업 단위."""

    __tablename__ = "work_orders"

    work_order_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    production_order_id: Mapped[int] = mapped_column(ForeignKey("production_orders.id"))
    process_name: Mapped[str] = mapped_column(String(100))
    qty_plan: Mapped[float] = mapped_column(Numeric(18, 4))
    qty_actual: Mapped[float] = mapped_column(Numeric(18, 4), default=0)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    # status: pending → in_progress → completed / cancelled

    production_order: Mapped["ProductionOrder"] = relationship(back_populates="work_orders")
