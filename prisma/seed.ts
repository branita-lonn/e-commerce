// prisma/seed.ts
// Database seeding script for development

import { PrismaClient, FontChoice } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Create Store Owner
  const hashedOwnerPassword = await bcryptjs.hash("miduka2024", 12);
  const owner = await prisma.user.upsert({
    where: { email: "owner@miduka.com" },
    update: {},
    create: {
      email: "owner@miduka.com",
      name: "Store Owner",
      password: hashedOwnerPassword,
      role: "STORE_OWNER",
    },
  });
  console.log(`Upserted owner account: ${owner.email}`);

  // 2. Create Store Settings (Singleton)
  const existingSettings = await prisma.storeSettings.findFirst();
  if (!existingSettings) {
    await prisma.storeSettings.create({
      data: {
        storeName: "MiDuka",
        storeTagline: "Your neighbourhood store, online.",
        accentColor: "#3B82F6",
        fontChoice: FontChoice.INTER,
        enableStripe: true,
        enableMpesa: true,
      },
    });
    console.log("Created Store Settings.");
  } else {
    console.log("Store Settings already exists.");
  }

  // 3. Create Categories
  const womenCategory = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: { name: "Women", slug: "women", isActive: true },
  });

  const dressesSubcategory = await prisma.category.upsert({
    where: { slug: "women-dresses" },
    update: {},
    create: { name: "Dresses", slug: "women-dresses", parentId: womenCategory.id, isActive: true },
  });

  const menCategory = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: { name: "Men", slug: "men", isActive: true },
  });
  console.log("Upserted Categories.");

  // 4. Create Sample Products
  const products = [
    {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      description: "A beautiful floral dress perfect for the summer.",
      price: 2500,
      categoryId: dressesSubcategory.id,
      isActive: true,
      isFeatured: true,
      stockQuantity: 50,
      isOnSale: false,
    },
    {
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      description: "Timeless denim jacket for everyday wear.",
      price: 4500,
      categoryId: womenCategory.id,
      isActive: true,
      isFeatured: true,
      stockQuantity: 30,
      isOnSale: true,
      compareAtPrice: 5500,
    },
    {
      name: "Men's Cotton T-Shirt",
      slug: "mens-cotton-t-shirt",
      description: "Comfortable 100% cotton t-shirt.",
      price: 1200,
      categoryId: menCategory.id,
      isActive: true,
      isFeatured: false,
      stockQuantity: 100,
      isOnSale: false,
    },
    {
      name: "Elegant Evening Gown",
      slug: "elegant-evening-gown",
      description: "Stunning gown for special occasions.",
      price: 8500,
      categoryId: dressesSubcategory.id,
      isActive: true,
      isFeatured: false,
      stockQuantity: 10,
      isOnSale: false,
    },
    {
      name: "Men's Chino Pants",
      slug: "mens-chino-pants",
      description: "Stylish and versatile chino pants.",
      price: 3200,
      categoryId: menCategory.id,
      isActive: true,
      isFeatured: false,
      stockQuantity: 40,
      isOnSale: true,
      compareAtPrice: 4000,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }
  console.log("Upserted Products.");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
