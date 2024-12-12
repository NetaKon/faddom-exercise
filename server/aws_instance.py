import boto3

from api_errors import CPUDataNotFoundError, InstanceNotFoundError
from utils import get_times_iso_8061_utc


class AWSInstance:
    ec2_client = boto3.client("ec2")
    cloud_watch_client = boto3.client("cloudwatch")

    def __init__(self, ip: str):
        self.id = self.get_instance_id_by_ip(ip)

        if not self.id:
            raise InstanceNotFoundError(f"Instance with IP {ip} not found.")

    @classmethod
    def get_instance_id_by_ip(cls, ip: str):
        filters = [{"Name": "private-ip-address", "Values": [ip]}]

        try:
            response = cls.ec2_client.describe_instances(Filters=filters)

            instances = [
                instance.get("InstanceId")
                for reservation in response.get("Reservations", [])
                for instance in reservation.get("Instances", [])
            ]

            return instances[0] if instances else None
        except Exception:
            raise RuntimeError(f"Error retrieving instance by IP {ip}")

    def get_cpu_usage(self, hours: float, interval: int):
        start_time, end_time = get_times_iso_8061_utc(hours)

        try:
            response = self.cloud_watch_client.get_metric_statistics(
                Namespace="AWS/EC2",
                MetricName="CPUUtilization",
                Dimensions=[
                    {"Name": "InstanceId", "Value": self.id},
                ],
                StartTime=start_time,
                EndTime=end_time,
                Period=interval,
                Statistics=[
                    "Average",
                ],
                Unit="Percent",
            )
        except Exception as e:
            raise RuntimeError(f"Error retrieving CPU usage: {e}")

        datapoints = response.get("Datapoints")

        if not datapoints:
            raise CPUDataNotFoundError(
                f"No CPU usage data found for the last {hours} hours."
            )

        result = sorted(datapoints, key=lambda point: point["Timestamp"])
        print(len(result))

        return result
