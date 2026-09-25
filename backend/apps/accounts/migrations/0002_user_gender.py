from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(
                choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('UNSPECIFIED', 'Prefer not to say')],
                default='UNSPECIFIED',
                max_length=20,
            ),
        ),
    ]