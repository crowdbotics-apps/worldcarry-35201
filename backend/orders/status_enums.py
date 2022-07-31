from enum import Enum


class OrderActivityLogTypes(Enum):
    request = 1
    in_transit = 2
    received = 3
    cancel = 4


OrderActivityLogTypes.request.label = 'Order Request Initiated'
OrderActivityLogTypes.in_transit.label = 'Order In Transit'
OrderActivityLogTypes.received.label = 'Order Received'
OrderActivityLogTypes.cancel.label = 'Order Cancel'


ORDER_ACTIVITY_LOG_TYPES = [(order_activity_log_type.value, order_activity_log_type.label)
                            for order_activity_log_type in OrderActivityLogTypes]
