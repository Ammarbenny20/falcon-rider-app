from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('safety', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sosalert',
            name='alert_type',
            field=models.CharField(
                choices=[('POLICE', 'Police'), ('MEDICAL', 'Medical'), ('GENERAL', 'General / Other')],
                default='GENERAL',
                max_length=20,
            ),
        ),
    ]