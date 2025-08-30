from core.models import EnumType, EnumSector, EnumColorTheme

types = ["Non-Profit", "Startup", "Community", "Educational"]
sectors = ["Sport", "Music", "Art", "Technology"]
color_themes = ["light", "dark", "system"]

# Seeder function
def seed_model(model_class, data_list):
    for item in data_list:
        _, created = model_class.objects.get_or_create(name=item)
        if created:
            print(f"Created {model_class.__name__}: {item}")

def run_seeder():
    seed_model(EnumType, types)
    seed_model(EnumSector, sectors)
    seed_model(EnumColorTheme, color_themes)
    print("Seeding completed!")
