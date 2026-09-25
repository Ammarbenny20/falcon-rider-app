from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rider_requests', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='riderrequest',
            name='preferred_copassenger_gender',
            field=models.CharField(
                choices=[('ANY', 'Any'), ('FEMALE_ONLY', 'Female passengers only'), ('MALE_ONLY', 'Male passengers only')],
                default='ANY',
                max_length=20,
            ),
        ),
    ]