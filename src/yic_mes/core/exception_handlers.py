import logging

from fastapi import Request
from fastapi.responses import JSONResponse

from yic_mes.core.exceptions import (
    AppError,
    AuthenticationError,
    AuthorizationError,
    DuplicateError,
    NotFoundError,
)

logger = logging.getLogger(__name__)

_STATUS_MAP: dict[type[AppError], int] = {
    NotFoundError: 404,
    DuplicateError: 409,
    AuthenticationError: 401,
    AuthorizationError: 403,
}


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    status_code = _STATUS_MAP.get(type(exc), 422)
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.message,
            "error_code": exc.code,
        },
    )


async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "data": None,
            "message": "Internal server error",
            "error_code": "INTERNAL_ERROR",
        },
    )
