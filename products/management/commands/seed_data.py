from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seed database with sample optical products'

    def handle(self, *args, **kwargs):
        # Categories
        eyeglasses, _ = Category.objects.get_or_create(name='Eyeglasses')
        sunglasses, _ = Category.objects.get_or_create(name='Sunglasses')
        contact_lenses, _ = Category.objects.get_or_create(name='Contact Lenses')
        computer_glasses, _ = Category.objects.get_or_create(name='Computer Glasses')
        reading_glasses, _ = Category.objects.get_or_create(name='Reading Glasses')

        products = [
            # Eyeglasses
            {'name': 'Classic Aviator Frame', 'description': 'Timeless aviator-style eyeglasses with lightweight titanium frame. Perfect for everyday wear with anti-scratch coating.', 'price': 2499.00, 'category': eyeglasses},
            {'name': 'Retro Round Frame', 'description': 'Vintage-inspired round eyeglasses with acetate frame. Features spring hinges for comfortable all-day wear.', 'price': 1999.00, 'category': eyeglasses},
            {'name': 'Modern Rectangle Frame', 'description': 'Sleek rectangular eyeglasses with ultra-thin stainless steel frame. Comes with blue-light filter coating.', 'price': 3299.00, 'category': eyeglasses},
            {'name': 'Rimless Elegance', 'description': 'Minimalist rimless eyeglasses with flexible memory metal temples. Virtually weightless at just 12g.', 'price': 4499.00, 'category': eyeglasses},

            # Sunglasses
            {'name': 'Polarized Wayfarer', 'description': 'Iconic wayfarer sunglasses with polarized UV400 lenses. 100% UVA/UVB protection in a classic design.', 'price': 3499.00, 'category': sunglasses},
            {'name': 'Sport Wrap-Around', 'description': 'High-performance wrap-around sunglasses designed for sports. Impact-resistant polycarbonate lenses with anti-fog coating.', 'price': 2799.00, 'category': sunglasses},
            {'name': 'Cat-Eye Glam', 'description': 'Fashion-forward cat-eye sunglasses with gradient lenses. Handcrafted acetate frame with gold-tone accents.', 'price': 4999.00, 'category': sunglasses},
            {'name': 'Oversized Square', 'description': 'Bold oversized square sunglasses with mirror coating. Statement piece with full UV protection.', 'price': 3799.00, 'category': sunglasses},

            # Contact Lenses
            {'name': 'Daily Fresh Clear Lenses (30 pack)', 'description': 'Ultra-comfortable daily disposable contact lenses with moisture-lock technology. Suitable for dry and sensitive eyes.', 'price': 1499.00, 'category': contact_lenses},
            {'name': 'Monthly Aqua Comfort (6 pack)', 'description': 'Monthly replacement contact lenses with silicone hydrogel material. Allows maximum oxygen flow for healthier eyes.', 'price': 2199.00, 'category': contact_lenses},
            {'name': 'Color Pop Hazel (2 pack)', 'description': 'Natural-looking colored contact lenses in hazel. FDA-approved with UV protection and 3-month replacement cycle.', 'price': 999.00, 'category': contact_lenses},

            # Computer Glasses
            {'name': 'BluShield Pro', 'description': 'Advanced blue-light blocking glasses designed for prolonged screen time. Reduces digital eye strain by up to 80%.', 'price': 1799.00, 'category': computer_glasses},
            {'name': 'GamerVision Elite', 'description': 'Gaming-optimized glasses with amber-tinted lenses. Enhances contrast and reduces glare from monitors.', 'price': 2499.00, 'category': computer_glasses},
            {'name': 'Office Clear View', 'description': 'Professional-looking clear glasses with subtle blue-light filter. Ideal for office professionals working 8+ hours on screens.', 'price': 1299.00, 'category': computer_glasses},

            # Reading Glasses
            {'name': 'Compact Folding Reader +1.5', 'description': 'Ultra-compact folding reading glasses with hard case. Spring-loaded hinges and scratch-resistant lenses.', 'price': 699.00, 'category': reading_glasses},
            {'name': 'Premium Progressive Reader', 'description': 'Progressive reading glasses with multifocal lenses. Seamless transition between near and far vision.', 'price': 5499.00, 'category': reading_glasses},
            {'name': 'Lightweight Half-Frame Reader +2.0', 'description': 'Classic half-frame reading glasses in tortoise pattern. Lightweight at 15g with anti-reflective coating.', 'price': 899.00, 'category': reading_glasses},
        ]

        created_count = 0
        for p in products:
            _, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'description': p['description'],
                    'price': p['price'],
                    'category': p['category'],
                }
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {created_count} products across {Category.objects.count()} categories'))
