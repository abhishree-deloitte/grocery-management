import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // User
  const user = await prisma.user.upsert({
    where: { username: 'manager1' },
    update: {},
    create: {
      username: 'manager1',
      password: '$2a$10$FfAKh8OTKyOZBGOskV1n0eBhErOrwG.a2nU/Nz2mEUIjGwEKs2n8q', // bcrypt for "password123"
      firstName: 'Manager',
      lastName: 'One',
      email: 'manager1@grocery.com',
      phone: '9999999999',
    },
  });

  // Suppliers
  const supplier = await prisma.supplier.create({
    data: {
      name: 'DailyFresh Supplier',
      email: 'fresh@supplier.com',
      phone: '8888888888',
    },
  });

  // Products
  const product = await prisma.product.create({
    data: {
      name: 'Wheat Flour 1kg',
      type: 'Grocery',
      supplierId: supplier.id,
    },
  });

  // Shipments
  await prisma.shipment.create({
    data: {
      productId: product.id,
      supplierId: supplier.id,
      quantity: 100,
      price: 45,
      deliveryDate: new Date(),
      shipperName: 'Delhivery',
      shipmentDestination: 'Delhi',
      shipmentStatus: 'In-Transit',
      lat: 28.6139,
      long: 77.2090,
    },
  });

  // Stock
  await prisma.stock.create({
    data: {
      productId: product.id,
      quantity: 80,
      price: 45,
      sellingPrice: 55,
      dateAdded: new Date(),
      status: 'Available',
      cashier: 'Cashier A',
      consumerName: 'Regular Customer',
    },
  });

  // Blogs
  await prisma.blog.createMany({
    data: [
      {
        image: 'https://image.com/blog1.jpg',
        title: 'How to Store Vegetables Safely',
        description: 'A quick guide to storing vegetables.',
        createdBy: 'Manager One',
        createdDate: new Date('2023-01-01'),
        year: 2023,
      },
      {
        image: 'https://image.com/blog2.jpg',
        title: 'Why FIFO Matters in Grocery',
        description: 'Understanding FIFO in stock rotation.',
        createdBy: 'Manager One',
        createdDate: new Date('2024-01-15'),
        year: 2024,
      },
    ],
  });

  // Tasks
  await prisma.task.create({
    data: {
      userId: user.id,
      taskType: 'Order-Related',
      assignee: 'Team B',
      priorityLevel: 'Critical',
      description: 'Order 200 packets of milk',
      dueDate: new Date('2024-04-30'),
      location: 'Warehouse 3',
    },
  });
}

main()
  .then(() => {
    console.log('✅ Seed completed');
  })
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
