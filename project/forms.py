from django import forms
from .models import CustomUser


class RegisterForm(forms.Form):
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'Non-binary'),
    )

    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-input', 'format': '%Y-%m-%d'}),
                             label='Enter your email address', max_length=320)

    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-input'}),
                               label='Come up with a password', max_length=100)
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-input'}),
                                label='Your name', max_length=100)
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-input'}, ), label='Date of birth')
    #gender = forms.ChoiceField(choices=GENDERS)
