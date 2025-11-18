from django.db import migrations, models
import django.db.models.deletion


def forwards_fk_data_migration(apps, schema_editor):
    """
    Data migration function to convert old 'name' foreign key values 
    to new 'id' integer primary key values in all referencing tables.
    """
    FK_MAPPINGS = [
        ('UserProfile', 'color_theme', 'EnumColorTheme'),
        ('UserProfile', 'language', 'EnumLanguage'),
        ('InsaClass', 'desc', 'Title'), 
        ('InsaEvenement', 'desc', 'Title'), 
        ('InsaEvenement', 'association', 'Association'),
        ('Association', 'type', 'EnumType'),
        ('Association', 'sector', 'EnumSector'),
        ('AssociationPublisher', 'association', 'Association'),
        ('UserColoredEvent', 'title', 'Title'),
        ('ClassLinkTD', 'td', 'GroupTD'),
        ('ClassLinkRoom', 'room', 'Room'),
        ('ClassLinkTeacher', 'teacher', 'Teacher'),
        ('ClassLinkDepart', 'depart', 'Department'),
        ('UserLinkTD', 'name_td', 'GroupTD'),
        ('UserLinkAssociation', 'name_assos', 'Association'),
    ]

    for source_model_name, fk_field_name, target_model_name in FK_MAPPINGS:
        SourceModel = apps.get_model('core', source_model_name)
        TargetModel = apps.get_model('core', target_model_name)

        id_lookup = {
            getattr(obj, 'name'): getattr(obj, 'id')
            for obj in TargetModel.objects.all()
        }
        
        old_fk_column = f'{fk_field_name}_id'
        new_fk_column = f'{fk_field_name}_id_temp' 

        print(f"Starting data copy for {source_model_name}.{fk_field_name}...")

        for obj in SourceModel.objects.all():
            old_name_value = getattr(obj, old_fk_column)
            
            if old_name_value is not None and old_name_value in id_lookup:
                new_id_value = id_lookup[old_name_value]
                setattr(obj, new_fk_column, new_id_value)
                obj.save(update_fields=[new_fk_column])
            elif old_name_value is None:
                 setattr(obj, new_fk_column, None)
                 obj.save(update_fields=[new_fk_column])
            else:
                 print(f"WARNING: Could not find ID for name '{old_name_value}' in {target_model_name}. Setting {new_fk_column} to NULL.")
                 setattr(obj, new_fk_column, None)
                 obj.save(update_fields=[new_fk_column])

def backwards_fk_data_migration(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_association_id_department_id_enumcolortheme_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='color_theme_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='language_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        
        migrations.AddField(
            model_name='insaclass',
            name='desc_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='insaevenement',
            name='desc_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        
        migrations.AddField(
            model_name='insaevenement',
            name='association_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        
        migrations.AddField(
            model_name='association',
            name='type_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='association',
            name='sector_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='associationpublisher',
            name='association_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='usercoloredevent',
            name='title_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='classlinktd',
            name='td_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='classlinkroom',
            name='room_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='classlinkteacher',
            name='teacher_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='classlinkdepart',
            name='depart_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='userlinktd',
            name='name_td_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='userlinkassociation',
            name='name_assos_id_temp',
            field=models.BigIntegerField(null=True),
        ),
        
        migrations.RunPython(forwards_fk_data_migration, backwards_fk_data_migration),
    ]