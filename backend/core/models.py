from django.db import models
from django.contrib.auth.models import User
import uuid
import hashlib
from django.utils import timezone


class EnumType(models.Model):
    """Possible values for the type in association"""

    name = models.CharField(max_length=255, primary_key=True)

    def __str__(self):
        return self.name


class EnumSector(models.Model):
    """Possible values for the sector (e.g., sport, music, etc.)"""

    name = models.CharField(max_length=255, primary_key=True)

    def __str__(self):
        return self.name


class EnumLanguage(models.Model):
    """Possible values for the sector (e.g., sport, music, etc.)"""

    name = models.CharField(max_length=255, primary_key=True)

    @classmethod
    def get_default_language(cls):
        language, created = cls.objects.get_or_create(name="fr")
        return language.pk

    def __str__(self):
        return self.name


class EnumColorTheme(models.Model):
    """Possible values for the color theme of the website"""

    name = models.CharField(max_length=100, primary_key=True)

    @classmethod
    def get_default_theme(cls):
        theme, created = cls.objects.get_or_create(name="system")
        return theme.pk

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """User definition"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    link_td = models.ManyToManyField(
        "GroupTD", through="UserLinkTD", related_name="users"
    )
    link_assos = models.ManyToManyField(
        "Association", through="UserLinkAssociation", related_name="users"
    )
    color_theme = models.ForeignKey(
        "EnumColorTheme",
        default=EnumColorTheme.get_default_theme,
        on_delete=models.SET_NULL,
        null=True,
    )
    language = models.ForeignKey(
        "EnumLanguage",
        default=EnumLanguage.get_default_language,
        on_delete=models.SET_NULL,
        null=True,
    )

    ics_uid = models.CharField(
        max_length=64,
        unique=True,
        editable=False,
        default="",
    )

    def save(self, *args, **kwargs):
        if not self.ics_uid:
            raw_value = f"{uuid.uuid4()}-{self.user_id}".encode("utf-8")
            self.ics_uid = hashlib.sha256(raw_value).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.user)


class UserRelationship(models.Model):
    class RelationshipType(models.TextChoices):
        PENDING = "PE", "pending"
        FRIEND = "FR", "friend"

    first_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="relationships_initiated"
    )
    second_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="relationships_received"
    )
    type = models.CharField(
        max_length=2,
        choices=RelationshipType.choices,
    )


class Event(models.Model):
    """Generic Class for defining events in the calendar"""

    uid = models.CharField(primary_key=True, editable=False, max_length=256)
    date = models.DateField()
    time_stamp = models.DateTimeField()
    start_hour = models.DateTimeField()
    end_hour = models.DateTimeField()
    time_created = models.DateTimeField()
    time_last_modified = models.DateTimeField()
    sequence = models.IntegerField(null=True)
    desc = models.ForeignKey("Title", on_delete=models.SET_NULL, null=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = str(uuid.uuid4())
        now = timezone.now()
        if not self.time_created:
            self.time_created = now
        self.time_last_modified = now
        if not self.sequence:
            self.sequence = 0

        super().save(*args, **kwargs)


class InsaClass(Event):
    """INSA Class definition"""

    link_room = models.ManyToManyField("Room", through="ClassLinkRoom")
    link_td = models.ManyToManyField("GroupTD", through="ClassLinkTD")
    link_teacher = models.ManyToManyField("Teacher", through="ClassLinkTeacher")
    link_depart = models.ManyToManyField("Department", through="ClassLinkDepart")

    def __str__(self):
        return f"Insa Class : {self.desc}"


class InsaEvenement(Event):
    """INSA Event definition"""

    associated_link = models.CharField(max_length=510)
    association = models.ForeignKey("Association", on_delete=models.CASCADE)
    location = models.CharField(max_length=510)
    info = models.CharField(max_length=510)

    def __str__(self):
        return f"Insa Event : {self.desc}"


class Association(models.Model):
    """Association profile for the club and association of INSA Rouen"""

    name = models.CharField(max_length=255, primary_key=True)
    color = models.CharField(max_length=7, default="#123456")
    type = models.ForeignKey("EnumType", on_delete=models.SET_NULL, null=True)
    sector = models.ForeignKey("EnumSector", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class AssociationPublisher(models.Model):
    """The user that can publish event of their association"""

    association = models.ForeignKey("Association", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserColoredEvent(models.Model):
    """The many to many relation table for custom colors on events"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.ForeignKey("Title", to_field="name", on_delete=models.CASCADE)
    color = models.CharField(max_length=7)

    def __str__(self):
        return f"{self.user.username} - {self.title} - {self.color}"


class GroupTD(models.Model):
    """GroupTD definition"""

    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name


class Department(models.Model):
    """Department definition"""

    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name


class Teacher(models.Model):
    name = models.CharField(max_length=255, primary_key=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    """Room definition"""

    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name


class Title(models.Model):
    name = models.CharField(max_length=255, primary_key=True)

    def __str__(self):
        return self.name


class ClassLinkTD(models.Model):
    """1 to Many link between InsaClass and GroupTD tables"""

    insa_class = models.ForeignKey(InsaClass, on_delete=models.CASCADE, db_index=True)
    td = models.ForeignKey(GroupTD, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"Class: {self.insa_class} - TD: {self.td}"


class ClassLinkRoom(models.Model):
    """1 to Many link between InsaClass and Room tables"""

    insa_class = models.ForeignKey(InsaClass, on_delete=models.CASCADE, db_index=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"Class: {self.insa_class} - Room: {self.room}"


class ClassLinkTeacher(models.Model):
    """1 to Many link between InsaClass and Teacher tables"""

    insa_class = models.ForeignKey(InsaClass, on_delete=models.CASCADE, db_index=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"Class: {self.insa_class} - Teacher: {self.teacher}"


class ClassLinkDepart(models.Model):
    """1 to Many link between InsaClass and Department tables"""

    insa_class = models.ForeignKey(InsaClass, on_delete=models.CASCADE, db_index=True)
    depart = models.ForeignKey(Department, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"Class: {self.insa_class} - Department: {self.depart}"


class UserLinkTD(models.Model):
    """1 to Many link between User and GroupTD"""

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_index=True)
    name_td = models.ForeignKey(GroupTD, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"User: {self.user} - TD: {self.name_td}"


class UserLinkAssociation(models.Model):
    """1 to Many link between User and Association"""

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_index=True)
    name_assos = models.ForeignKey(Association, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"User: {self.user} - Assos: {self.name_assos}"
