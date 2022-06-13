from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUserManager(BaseUserManager):
    def create_user(self, email, date_of_birth, first_name, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
            first_name=first_name

        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, date_of_birth, first_name, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
            first_name=first_name

        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'Non-binary'),
    )
    username = None
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    date_of_birth = models.DateField('Date of birth')
    first_name = models.CharField('First Name', max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_of_birth', 'first_name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):

        return True

    def has_module_perms(self, app_label):

        return True

    @property
    def is_staff(self):

        return self.is_admin


class Song(models.Model):
    title = models.TextField()
    artist = models.TextField()
    image = models.ImageField()
    audio_file = models.FileField(blank=True, null=True)
    genre = models.CharField(max_length=50)
    paginate_by = 2

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist,
            "image": self.image.url,
            "audio_file": self.audio_file.url,
            "genre": self.genre
        }

    def __str__(self):
        return self.title

