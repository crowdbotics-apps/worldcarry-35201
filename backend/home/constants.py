from enum import Enum


PRODUCT_TYPES = (
    ("Electronics", "Electronics"),
    ("Jewelry", "Jewelry"),
    ("Documents and Books", "Documents and Books"),
    ("Food items", "Food items"),
    ("Clothing", "Clothing"),
    ("Medication", "Medication")
)

WAIT_TIMES = (
    ('Up to 2 weeks', 'Up to 2 weeks'),
    ('Up to 3 weeks', 'Up to 3 weeks'),
    ('Up to 1 month', 'Up to 1 month'),
    ('Up to 2 months', 'Up to 2 months'),
    ('Up to 3 months', 'Up to 3 months')
)

ORDER_STATUS = (
    ('Unpaid', 'Unpaid'),
    ('Requested', 'Requested'),
    ('Accepted', 'Accepted'),
    ('In transit', 'In transit'),
    ('Received', 'Received'),
    ('Cancelled', 'Cancelled')
)

JOURNEY_TYPE = (
    ('One Way', 'One Way'),
    ('Round Trip', 'Round Trip')
)

JOURNEY_STATUS = (
    ('Upcoming', 'Upcoming'),
    ('Ongoing', 'Ongoing'),
    ('Completed', 'Completed'),
)


class JourneyStatus(Enum):
    ongoing = 'ongoing'
    upcoming = 'upcoming'
    completed = 'completed'

    def __str__(self):
        return self.type.value


JourneyStatus.ongoing.label = 'Ongoing'
JourneyStatus.upcoming.label = 'Upcoming'
JourneyStatus.completed.label = 'Completed'


JOURNEY_STATUS = ((JourneyStatus.ongoing.value, "Ongoing"),
                  (JourneyStatus.upcoming.value, "Upcoming"),
                  (JourneyStatus.completed.value, "Completed")
                  )


class JourneyRequestStatus(Enum):
    pending = 'pending'
    approved = 'approved'
    rejected = 'rejected'
    delivered = 'delivered'

    def __str__(self):
        return self.type.value


JourneyRequestStatus.pending.label = 'Pending'
JourneyRequestStatus.approved.label = 'Approved'
JourneyRequestStatus.rejected.label = 'Rejected'
JourneyRequestStatus.delivered.label = 'Delivered'


JOURNEY_REQUEST_STATUS = ((JourneyRequestStatus.pending.value, "Pending"),
                          (JourneyRequestStatus.approved.value, "Approved"),
                          (JourneyRequestStatus.rejected.value, "Rejected"),
                          (JourneyRequestStatus.delivered.value, "Delivered")
                          )
