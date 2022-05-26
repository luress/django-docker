from django.contrib import admin
from .models import Song, CustomUser
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-input'}),
                             label='Enter your email address', max_length=320)

    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-input'}),
                               label='Come up with a password', max_length=100)
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-input'}),
                               label='Come up with a password', max_length=100)
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-input'}),
                                 label='Your name', max_length=100)
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-input'}), label='Date of birth')

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'date_of_birth')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def clean_email(self):
        email = self.cleaned_data["email"]
        return email

    def clean_date_of_birth(self):
        date_of_birth = self.cleaned_data['date_of_birth']
        return date_of_birth

    def clean_first_name(self):
        first_name = self.cleaned_data["first_name"]
        return first_name

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'date_of_birth', 'is_active', 'is_admin')


class CustomUserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'date_of_birth', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('date_of_birth',)}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'date_of_birth', 'password1', 'password2', 'first_name'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(Song)
admin.site.register(CustomUser, CustomUserAdmin)
