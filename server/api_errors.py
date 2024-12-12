class APIError(Exception):
    pass


class InstanceNotFoundError(APIError):
    code = 404


class CPUDataNotFoundError(APIError):
    code = 404


class InvalidIntervalError(APIError):
    code = 422


class InvalidCombinationError(APIError):
    code = 422


class InvalidInputError(APIError):
    code = 422
