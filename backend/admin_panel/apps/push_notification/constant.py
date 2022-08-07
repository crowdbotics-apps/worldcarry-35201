from enum import Enum


class Push_Notification_Repeating_Days(Enum):
    ALL_DAYS_OF_WEEK = "All Days of Week"
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = 'Thursday'
    FRIDAY = 'Friday'
    SATURDAY = 'Saturday'
    SUNDAY = 'Sunday'
    WORKING_DAYS = 'Every Working Day (Monday - Friday)'
    WEEKENDS = 'Every Weekend (Saturday - Sunday)'

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

class Notication_Group_Name(Enum):
    
    PRE_LUNCH = "Pre Lunch"
    POST_LUNCH = "Post Lunch"
    FOLLOW_UP = "Follow Up"
    
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

class Push_Notification_Type(Enum):
    PRE_LUNCH = "Pre Lunch"
    POST_LUNCH = "Post Lunch"
    FOLLOW_UP = "Follow Up"
    
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

class Push_Notification_Status(Enum):
    PENDING = "Pending"
    SENT = "Sent"
    FAILED = "Failed"
    CANCELLED = "Cancelled"
    
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)