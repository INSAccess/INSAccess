from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_update_foreign_keys'),
    ]

    operations = [
        migrations.RemoveField(model_name='userprofile', name='color_theme',),
        migrations.RemoveField(model_name='userprofile', name='language',),
        migrations.RemoveField(model_name='insaclass', name='desc',),
        migrations.RemoveField(model_name='insaevenement', name='desc',), 
        migrations.RemoveField(model_name='insaevenement', name='association',),
        migrations.RemoveField(model_name='association', name='type',),
        migrations.RemoveField(model_name='association', name='sector',),
        migrations.RemoveField(model_name='associationpublisher', name='association',),
        migrations.RemoveField(model_name='usercoloredevent', name='title',),
        migrations.RemoveField(model_name='classlinktd', name='td',),
        migrations.RemoveField(model_name='classlinkroom', name='room',),
        migrations.RemoveField(model_name='classlinkteacher', name='teacher',),
        migrations.RemoveField(model_name='classlinkdepart', name='depart',),
        migrations.RemoveField(model_name='userlinktd', name='name_td',),
        migrations.RemoveField(model_name='userlinkassociation', name='name_assos',),

        migrations.AlterField(
            model_name='enumtype',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='enumsector',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='enumlanguage',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='enumcolortheme',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='association',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='grouptd',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='department',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='teacher',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='room',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),
        migrations.AlterField(
            model_name='title',
            name='name',
            field=models.CharField(max_length=255, unique=True), 
        ),

        migrations.AlterField(
            model_name='enumtype',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='enumsector',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='enumlanguage',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='enumcolortheme',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='association',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='grouptd',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='department',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='room',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='title',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),

        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name='userprofile',
                    name='color_theme',
                    field=models.ForeignKey(
                        db_column='color_theme_id_temp',
                        default=None, 
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.enumcolortheme'
                    ),
                    preserve_default=False,
                ),
                migrations.AddField(
                    model_name='userprofile',
                    name='language',
                    field=models.ForeignKey(
                        db_column='language_id_temp',
                        default=None, 
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.enumlanguage'
                    ),
                    preserve_default=False,
                ),
                
                migrations.AddField(
                    model_name='insaclass',
                    name='desc',
                    field=models.ForeignKey(
                        db_column='desc_id_temp',
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.title'
                    ),
                ),
                
                migrations.AddField(
                    model_name='insaevenement',
                    name='desc',
                    field=models.ForeignKey(
                        db_column='desc_id_temp',
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.title'
                    ),
                ),
                migrations.AddField(
                    model_name='insaevenement',
                    name='association',
                    field=models.ForeignKey(
                        db_column='association_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.association'
                    ),
                ),
                
                migrations.AddField(
                    model_name='association',
                    name='type',
                    field=models.ForeignKey(
                        db_column='type_id_temp',
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.enumtype'
                    ),
                    preserve_default=False,
                ),
                migrations.AddField(
                    model_name='association',
                    name='sector',
                    field=models.ForeignKey(
                        db_column='sector_id_temp',
                        null=True, 
                        on_delete=django.db.models.deletion.SET_NULL, 
                        to='core.enumsector'
                    ),
                    preserve_default=False,
                ),
                
                migrations.AddField(
                    model_name='associationpublisher',
                    name='association',
                    field=models.ForeignKey(
                        db_column='association_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.association'
                    ),
                ),

                migrations.AddField(
                    model_name='usercoloredevent',
                    name='title',
                    field=models.ForeignKey(
                        db_column='title_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.title'
                    ),
                ),

                migrations.AddField(
                    model_name='classlinktd',
                    name='td',
                    field=models.ForeignKey(
                        db_column='td_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.grouptd'
                    ),
                ),
                
                migrations.AddField(
                    model_name='classlinkroom',
                    name='room',
                    field=models.ForeignKey(
                        db_column='room_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.room'
                    ),
                ),
                
                migrations.AddField(
                    model_name='classlinkteacher',
                    name='teacher',
                    field=models.ForeignKey(
                        db_column='teacher_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.teacher'
                    ),
                ),
                
                migrations.AddField(
                    model_name='classlinkdepart',
                    name='depart',
                    field=models.ForeignKey(
                        db_column='depart_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.department'
                    ),
                ),

                migrations.AddField(
                    model_name='userlinktd',
                    name='name_td',
                    field=models.ForeignKey(
                        db_column='name_td_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.grouptd'
                    ),
                ),

                migrations.AddField(
                    model_name='userlinkassociation',
                    name='name_assos',
                    field=models.ForeignKey(
                        db_column='name_assos_id_temp',
                        on_delete=django.db.models.deletion.CASCADE, 
                        to='core.association'
                    ),
                ),
            ]
        ),

        migrations.RenameField(model_name='userprofile', old_name='color_theme_id_temp', new_name='color_theme_id',),
        migrations.RenameField(model_name='userprofile', old_name='language_id_temp', new_name='language_id',),

        migrations.RenameField(model_name='insaclass', old_name='desc_id_temp', new_name='desc_id',),

        migrations.RenameField(model_name='insaevenement', old_name='desc_id_temp', new_name='desc_id',),
        migrations.RenameField(model_name='insaevenement', old_name='association_id_temp', new_name='association_id',),


        migrations.RenameField(model_name='association', old_name='type_id_temp', new_name='type_id',),
        migrations.RenameField(model_name='association', old_name='sector_id_temp', new_name='sector_id',),

        migrations.RenameField(model_name='associationpublisher', old_name='association_id_temp', new_name='association_id',),

        migrations.RenameField(model_name='usercoloredevent', old_name='title_id_temp', new_name='title_id',),

        migrations.RenameField(model_name='classlinktd', old_name='td_id_temp', new_name='td_id',),

        migrations.RenameField(model_name='classlinkroom', old_name='room_id_temp', new_name='room_id',),

        migrations.RenameField(model_name='classlinkteacher', old_name='teacher_id_temp', new_name='teacher_id',),

        migrations.RenameField(model_name='classlinkdepart', old_name='depart_id_temp', new_name='depart_id',),

        migrations.RenameField(model_name='userlinktd', old_name='name_td_id_temp', new_name='name_td_id',),

        migrations.RenameField(model_name='userlinkassociation', old_name='name_assos_id_temp', new_name='name_assos_id',),
    ]