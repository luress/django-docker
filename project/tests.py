import datetime

from django.test import Client, TestCase
from .forms import UserCreationForm


class IndexTestCase(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    #def test_get_index_endpoint(self):
        #response = self.client.get('/')
        #self.assertEqual(response.status_code, 200)


class SignUpTestCase(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    def test_get_register_endpoint(self):
        response = self.client.get('/signup')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name='signup.html')


class SignUpTestForm(TestCase):

    def test_signup_form_valid_data(self):
        form = UserCreationForm(data={
            'email': 'lures@example.com',
            'password1': 'Lorelo77',
            'password2': 'Lorelo77',
            'first_name': 'Yurii',
            'date_of_birth': datetime.date(2000, 3, 3)
        })
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, 'lures@example.com')
        self.assertEqual(user.first_name,'Yurii')
        self.assertEqual(user.date_of_birth, datetime.date(2000, 3, 3))

    def test_signup_form_no_data(self):
        form = UserCreationForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 5)
