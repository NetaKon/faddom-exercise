from datetime import datetime, timedelta, timezone

from api_errors import *


def get_times_iso_8061_utc(hours: float):
    end_time = datetime.now(timezone.utc).replace(microsecond=0)
    start_time = end_time - timedelta(hours=hours)

    return start_time.astimezone().isoformat(), end_time.astimezone().isoformat()


def validate_interval(hours: float, interval: int):
    if hours <= 0:
        raise InvalidInputError("'period' must be positive.")

    if interval <= 0:
        raise InvalidInputError("'interval' must be a positive integer.")

    if hours <= 15 * 24 and interval % 60:
        raise InvalidIntervalError(
            "'interval' must be a multiple of 60 seconds (1 minute)"
        )

    if hours > 63 * 24 and interval % 3600:
        raise InvalidIntervalError(
            "For time period greater then 63 days 'interval' must be a multiple of 3600 seconds (1 hour)"
        )

    if hours > 15 * 24 and interval % 300:
        raise InvalidIntervalError(
            "For time period between 15 and 63 days 'interval' must be a multiple of 300 seconds (5 minutes)"
        )

    num_data_points = int((hours * 3600) // interval)

    if num_data_points > 1440:
        raise InvalidCombinationError(
            f"You have requested up to {num_data_points} datapoints, which exceeds the limit of 1440. Increase the interval or decrease the time range to reduce the data points requested."
        )
