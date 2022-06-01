from django.test import Client, TestCase
from .forms import RegisterForm


class IndexTestCase(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    def test_get_index_endpoint(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


class RegisterTestCase(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    def test_get_register_endpoint(self):
        response = self.client.get('/register')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name='register.html')


class RegisterTestForm(TestCase):

    def test_signup_form_valid_data(self):
        form = RegisterForm(data={
            'email': 'lures@example.com',
            'password': 'Lorelo77',
            'first_name': 'Yurii',
            'date_of_birth': '2000-03-03'
        })
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, 'lures@example.com')
        self.assertEqual(user.first_name,'Yurii')
        self.assertEqual(user.date_of_birth, '2000-03-03')

    def test_signup_form_no_data(self):
        form = RegisterForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 4)
