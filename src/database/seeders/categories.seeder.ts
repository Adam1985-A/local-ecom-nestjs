import { DataSource } from 'typeorm';
import { Category } from '../../categories/category.entity.js';
import { BusinessType } from '../../common/enums/business-type.enum.js';

interface ChildSeed { name: string; slug: string; description: string; sortOrder: number; }
interface CategorySeed {
  name: string; slug: string; description: string;
  businessType: BusinessType; sortOrder: number;
  children: ChildSeed[];
}

const SEEDS: CategorySeed[] = [
  {
    name: 'Gas Cylinders', slug: 'gas-cylinders', businessType: BusinessType.GAS, sortOrder: 1,
    description: 'LPG cylinder refills and replacements in all sizes',
    children: [
      { name: '3kg Cylinder',    slug: 'gas-3kg',      description: 'Small 3 kg gas cylinders',              sortOrder: 1 },
      { name: '5kg Cylinder',    slug: 'gas-5kg',      description: 'Medium 5 kg gas cylinders',             sortOrder: 2 },
      { name: '12.5kg Cylinder', slug: 'gas-12-5kg',   description: 'Standard 12.5 kg household cylinders',  sortOrder: 3 },
      { name: '25kg Cylinder',   slug: 'gas-25kg',     description: 'Commercial 25 kg gas cylinders',        sortOrder: 4 },
      { name: '50kg Cylinder',   slug: 'gas-50kg',     description: 'Industrial 50 kg gas cylinders',        sortOrder: 5 },
    ],
  },
  {
    name: 'Water', slug: 'water', businessType: BusinessType.WATER, sortOrder: 2,
    description: 'Pure drinking water in all sizes',
    children: [
      { name: 'Sachet Water',         slug: 'sachet-water',         description: '500 ml pure water sachets',        sortOrder: 1 },
      { name: 'Table Water Bottles',  slug: 'table-water-bottles',  description: '75 cl and 1.5 L bottles',          sortOrder: 2 },
      { name: 'Dispenser Water 10L',  slug: 'dispenser-water-10l',  description: '10-litre dispenser bottles',       sortOrder: 3 },
      { name: 'Dispenser Water 20L',  slug: 'dispenser-water-20l',  description: '20-litre dispenser bottles',       sortOrder: 4 },
    ],
  },
  {
    name: 'Groceries', slug: 'groceries', businessType: BusinessType.GROCERIES, sortOrder: 3,
    description: 'Fresh and packaged food items for everyday needs',
    children: [
      { name: 'Grains & Rice',            slug: 'grains-rice',           description: 'Rice, beans, maize and other grains',        sortOrder: 1 },
      { name: 'Cooking Oil & Seasoning',  slug: 'cooking-oil-seasoning', description: 'Vegetable oil, palm oil, seasoning cubes',   sortOrder: 2 },
      { name: 'Fruits & Vegetables',      slug: 'fruits-vegetables',     description: 'Fresh seasonal produce',                     sortOrder: 3 },
      { name: 'Dairy & Eggs',             slug: 'dairy-eggs',            description: 'Milk, eggs, butter, cheese',                 sortOrder: 4 },
      { name: 'Beverages & Drinks',       slug: 'beverages-drinks',      description: 'Soft drinks, juices, water',                 sortOrder: 5 },
      { name: 'Snacks & Confectionery',   slug: 'snacks-confectionery',  description: 'Biscuits, sweets, chocolates',               sortOrder: 6 },
    ],
  },
  {
    name: 'Medicines', slug: 'medicines', businessType: BusinessType.MEDICINES, sortOrder: 4,
    description: 'Prescription and over-the-counter medicines',
    children: [
      { name: 'Pain Relief',           slug: 'pain-relief',          description: 'Paracetamol, ibuprofen, aspirin',         sortOrder: 1 },
      { name: 'Antibiotics',           slug: 'antibiotics',          description: 'Prescription antibiotic medicines',       sortOrder: 2 },
      { name: 'Vitamins & Supplements',slug: 'vitamins-supplements', description: 'Daily vitamins and health supplements',   sortOrder: 3 },
      { name: 'First Aid',             slug: 'first-aid',            description: 'Bandages, antiseptics, plasters',         sortOrder: 4 },
      { name: 'Malaria & Fever',       slug: 'malaria-fever',        description: 'Antimalarial and fever treatments',       sortOrder: 5 },
    ],
  },
  {
    name: 'Food', slug: 'food', businessType: BusinessType.FOOD, sortOrder: 5,
    description: 'Ready-to-eat meals and food delivery',
    children: [
      { name: 'Nigerian Soups',    slug: 'nigerian-soups',    description: 'Egusi, ogbono, vegetable, bitterleaf soups',      sortOrder: 1 },
      { name: 'Rice Dishes',       slug: 'rice-dishes',       description: 'Jollof rice, fried rice, coconut rice',           sortOrder: 2 },
      { name: 'Fast Food & Snacks',slug: 'fast-food-snacks',  description: 'Burgers, shawarma, puff-puff, meat pie',          sortOrder: 3 },
      { name: 'Swallow & Fufu',    slug: 'swallow-fufu',      description: 'Eba, pounded yam, amala, fufu',                  sortOrder: 4 },
      { name: 'Grills & BBQ',      slug: 'grills-bbq',        description: 'Suya, asun, peppered gizzard, chicken',           sortOrder: 5 },
      { name: 'Drinks & Smoothies',slug: 'food-drinks',       description: 'Fresh juices, smoothies, cold drinks',            sortOrder: 6 },
    ],
  },
  {
    name: 'Laundry', slug: 'laundry', businessType: BusinessType.LAUNDRY, sortOrder: 6,
    description: 'Professional laundry and dry-cleaning services',
    children: [
      { name: 'Wash & Fold',       slug: 'wash-fold',      description: 'Regular washing and folding per kg',        sortOrder: 1 },
      { name: 'Wash & Iron',       slug: 'wash-iron',      description: 'Washing and ironing per piece',             sortOrder: 2 },
      { name: 'Dry Cleaning',      slug: 'dry-cleaning',   description: 'Suits, dresses, delicate fabrics',          sortOrder: 3 },
      { name: 'Beddings & Curtains',slug:'beddings-curtains',description: 'Duvets, bed sheets, curtains',            sortOrder: 4 },
      { name: 'Shoe Cleaning',     slug: 'shoe-cleaning',  description: 'Sneakers, leather shoes, canvas',           sortOrder: 5 },
    ],
  },
];

/**
 * Seeds the full category tree for all 6 business verticals.
 * Safe to run multiple times — skips existing slugs.
 */
export async function seedCategories(dataSource: DataSource): Promise<Category[]> {
  const repo = dataSource.getRepository(Category);
  const all: Category[] = [];

  for (const seed of SEEDS) {
    let parent = await repo.findOne({ where: { slug: seed.slug } });

    if (!parent) {
      parent = await repo.save(
        repo.create({
          name: seed.name, slug: seed.slug, description: seed.description,
          businessType: seed.businessType, sortOrder: seed.sortOrder, isActive: true,
        }),
      );
      all.push(parent);
      console.log(`  ✅ Category: ${seed.name}`);
    } else {
      console.log(`  ⚠️  "${seed.slug}" exists — skipping`);
    }

    for (const child of seed.children) {
      let childCat = await repo.findOne({ where: { slug: child.slug } });
      if (!childCat) {
        childCat = await repo.save(
          repo.create({
            name: child.name, slug: child.slug, description: child.description,
            businessType: seed.businessType, parentId: parent.id,
            sortOrder: child.sortOrder, isActive: true,
          }),
        );
        all.push(childCat);
        console.log(`       ✅ ${child.name}`);
      }
    }
  }

  return all;
}