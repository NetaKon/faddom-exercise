from flask import Flask, request, jsonify
from flask_cors import CORS

from aws_instance import AWSInstance
from api_errors import *
from utils import validate_interval

DAY = 24  # hours
HOUR = 3600  # seconds

app = Flask(__name__)

cors = CORS(app, resources={r"/get-cpu-usage*": {"origins": "http://localhost:5173"}})


@app.errorhandler(APIError)
def handle_exception(err):
    return jsonify({"error": err.args[0]}), err.code


@app.route("/get-cpu-usage")
def get_cpu_usage():
    ip = request.args.get("ip")

    if ip is None:
        raise InvalidInputError("Missing ip value")

    try:
        period = request.args.get("period", default=DAY, type=float)
    except ValueError:
        raise InvalidInputError("'period' must be a positive integer")

    try:
        interval = request.args.get("interval", default=HOUR, type=int)
    except ValueError:
        raise InvalidInputError("'interval' must be a number")

    validate_interval(hours=period, interval=interval)

    aws_instance = AWSInstance(ip)
    data = aws_instance.get_cpu_usage(hours=period, interval=interval)

    return jsonify({"Datapoints": data}), 200


if __name__ == "__main__":
    app.run()
