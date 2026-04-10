from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from yic_mes.core.config import settings
from yic_mes.core.exception_handlers import app_error_handler, unhandled_error_handler
from yic_mes.core.exceptions import AppError
from yic_mes.controllers.production_order import router as production_order_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(Exception, unhandled_error_handler)

    # Routers
    app.include_router(production_order_router, prefix="/api/v1")

    return app


app = create_app()
