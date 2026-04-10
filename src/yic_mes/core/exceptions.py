class AppError(Exception):
    """애플리케이션 기본 예외."""

    def __init__(self, message: str, code: str = "APP_ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: int | str):
        super().__init__(f"{resource} #{resource_id} not found", "NOT_FOUND")


class BusinessError(AppError):
    def __init__(self, message: str):
        super().__init__(message, "BUSINESS_ERROR")


class DuplicateError(AppError):
    def __init__(self, resource: str, field: str, value: str):
        super().__init__(f"{resource} with {field}='{value}' already exists", "DUPLICATE")


class AuthenticationError(AppError):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "AUTH_FAILED")


class AuthorizationError(AppError):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, "FORBIDDEN")
