
from django.db import models
from django.contrib.auth.models import User



class UserProfile(models.Model):
    """User definition"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    link_td = models.ManyToManyField("GroupTD", through='UserLinkTD', related_name='users')

    def __str__(self):
        return str(self.user)
    

class Event(models.Model):
    """Generic Class for defining events in the calendar"""
    uid = models.CharField(primary_key = True, editable = False)
    date = models.DateField()
    start_hour = models.TimeField()
    end_hour = models.TimeField()
    desc = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        abstract = True


class InsaClass(Event):
    """INSA Class definition"""
    link_room = models.ManyToManyField('Room', through='ClassLinkRoom')
    link_td = models.ManyToManyField('GroupTD', through='ClassLinkTD')
    link_teacher = models.ManyToManyField('Teacher', through='ClassLinkTeacher')
    link_depart = models.ManyToManyField('Department', through='ClassLinkDepart')

    def __str__(self):
        return f"Insa Class : {self.desc}"


class InsaEvenement(Event):
    """INSA Event definition"""
    associated_link = models.CharField(max_length=510)
    association = models.ForeignKey('Association', on_delete=models.CASCADE)
    evenement_link_event_room = models.ManyToManyField('EvenementRoom', through='EvenementLinkEventRoom')

    def __str__(self):
        return f"Insa Event : {self.desc}"


class Association(models.Model):
    """Association profile for the club and association of INSA Rouen"""
    name = models.CharField(max_length=255, primary_key=True)
    user_email = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    unique_color = models.ForeignKey('EnumColor', on_delete=models.SET_NULL, null= True)
    type = models.ForeignKey('EnumType', on_delete=models.SET_NULL, null= True)
    sector = models.ForeignKey('EnumSector', on_delete=models.SET_NULL, null= True)

    def __str__(self):
        return self.name


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


class EnumColor(models.Model):
    """Possible values for the color of the association"""
    value = models.CharField(max_length=255, primary_key=True)
    user_friendly_name = models.CharField(max_length=255)

    def __str__(self):
        return self.value


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


class EvenementRoom(models.Model):
    """Special room for event definition"""
    name = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name


class EvenementLinkEventRoom(models.Model):
    """1 to Many link between InsaEvenement and EvenementRoom tables"""
    evenement = models.ForeignKey(InsaEvenement, on_delete=models.CASCADE, related_name='evenement_link_evenement_room', db_index=True)
    room = models.ForeignKey(EvenementRoom, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return f"Link: {self.evenement} - {self.room}"


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

