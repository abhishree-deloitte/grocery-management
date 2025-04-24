import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Manager User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { username: "manager1" },
    update: {},
    create: {
      username: "manager1",
      password: hashedPassword,
      firstName: "Manager",
      lastName: "One",
      email: "manager1@grocery.com",
      phone: "9999999999",
    },
  });

  // Suppliers
  const suppliers = await prisma.$transaction([
    prisma.supplier.create({
      data: { name: "FreshFarm", email: "fresh@farm.com", phone: "1234567890" },
    }),
    prisma.supplier.create({
      data: {
        name: "OrganicRoots",
        email: "roots@org.com",
        phone: "1234509876",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "DailyGrocers",
        email: "daily@groc.com",
        phone: "1122334455",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "HarvestMore",
        email: "harvest@more.com",
        phone: "2233445566",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "BulkSource",
        email: "bulk@source.com",
        phone: "3344556677",
      },
    }),
  ]);

  // Products
  const products = await prisma.$transaction([
    prisma.product.create({
      data: { name: "Rice 1kg", type: "Grain", supplierId: suppliers[0].id },
    }),
    prisma.product.create({
      data: {
        name: "Wheat Flour 1kg",
        type: "Grain",
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: { name: "Milk 500ml", type: "Dairy", supplierId: suppliers[2].id },
    }),
    prisma.product.create({
      data: { name: "Eggs 12pc", type: "Protein", supplierId: suppliers[3].id },
    }),
    prisma.product.create({
      data: { name: "Butter 100g", type: "Dairy", supplierId: suppliers[4].id },
    }),
  ]);

  // Shipments
  await Promise.all([
    prisma.shipment.create({
      data: {
        productId: products[0].id,
        supplierId: products[0].supplierId,
        quantity: 100,
        price: 40,
        deliveryDate: new Date("2024-04-01"),
        shipperName: "BlueDart",
        shipmentDestination: "Delhi",
        shipmentStatus: "Completed",
        lat: 28.61,
        long: 77.2,
      },
    }),
    prisma.shipment.create({
      data: {
        productId: products[1].id,
        supplierId: products[1].supplierId,
        quantity: 120,
        price: 35,
        deliveryDate: new Date("2024-04-05"),
        shipperName: "DHL",
        shipmentDestination: "Mumbai",
        shipmentStatus: "In-Transit",
        lat: 19.07,
        long: 72.87,
      },
    }),
    prisma.shipment.create({
      data: {
        productId: products[2].id,
        supplierId: products[2].supplierId,
        quantity: 80,
        price: 20,
        deliveryDate: new Date("2024-03-20"),
        shipperName: "Delhivery",
        shipmentDestination: "Chennai",
        shipmentStatus: "Pending",
        lat: 13.08,
        long: 80.27,
      },
    }),
    prisma.shipment.create({
      data: {
        productId: products[3].id,
        supplierId: products[3].supplierId,
        quantity: 60,
        price: 50,
        deliveryDate: new Date("2024-04-10"),
        shipperName: "FedEx",
        shipmentDestination: "Kolkata",
        shipmentStatus: "Failed",
        lat: 22.57,
        long: 88.36,
      },
    }),
    prisma.shipment.create({
      data: {
        productId: products[4].id,
        supplierId: products[4].supplierId,
        quantity: 90,
        price: 60,
        deliveryDate: new Date("2024-04-08"),
        shipperName: "EcomExpress",
        shipmentDestination: "Bangalore",
        shipmentStatus: "Completed",
        lat: 12.97,
        long: 77.59,
      },
    }),
  ]);

  // Stock Entries
  await Promise.all(
    products.map(async (product, index) => {
      const quantities = [100, 50, 0, 80, 60];
      const prices = [40, 35, 20, 50, 60];
      const sellingPrices = [55, 50, 30, 65, 75];
      const dates = [
        new Date("2024-04-01"),
        new Date("2024-04-02"),
        new Date("2024-04-03"),
        new Date("2024-04-05"),
        new Date("2024-04-06"),
      ];
      const statuses = [
        "Available",
        "Low",
        "OutOfStock",
        "Available",
        "Available",
      ];
      const cashiers = [
        "Cashier A",
        "Cashier B",
        "Cashier C",
        "Cashier D",
        "Cashier E",
      ];
      const consumers = [
        "Customer X",
        "Customer Y",
        "Customer Z",
        "Customer A",
        "Customer B",
      ];

      // Create or update Stock summary
      const stock = await prisma.stock.upsert({
        where: { productId: product.id },
        update: {
          totalQty: { increment: quantities[index] },
        },
        create: {
          productId: product.id,
          totalQty: quantities[index],
        },
      });

      // Create stock entry log
      await prisma.stockEntry.create({
        data: {
          stockId: stock.id,
          quantity: quantities[index],
          price: prices[index],
          sellingPrice: sellingPrices[index],
          dateAdded: dates[index],
          status: statuses[index],
          cashier: cashiers[index],
          consumerName: consumers[index],
        },
      });
    })
  );

  // Blogs
  await prisma.blog.createMany({
    data: [
      {
        image: "https://img.com/blog1.jpg",
        title: "Grocery Hygiene Tips",
        description: "Keep your food clean.",
        createdBy: "Admin",
        createdDate: new Date("2022-03-01"),
        year: 2022,
      },
      {
        image: "https://img.com/blog2.jpg",
        title: "Benefits of Local Produce",
        description: "Why local sourcing matters.",
        createdBy: "Admin",
        createdDate: new Date("2023-04-12"),
        year: 2023,
      },
      {
        image: "https://img.com/blog3.jpg",
        title: "Stock Rotation Techniques",
        description: "FIFO & LIFO explained.",
        createdBy: "Admin",
        createdDate: new Date("2024-01-08"),
        year: 2024,
      },
      {
        image: "https://img.com/blog4.jpg",
        title: "Cold Storage 101",
        description: "Preserve perishables effectively.",
        createdBy: "Admin",
        createdDate: new Date("2024-02-18"),
        year: 2024,
      },
      {
        image: "https://img.com/blog5.jpg",
        title: "Bulk Buying Myths",
        description: "Is it really cheaper?",
        createdBy: "Admin",
        createdDate: new Date("2024-03-22"),
        year: 2024,
      },
    ],
    skipDuplicates: true,
  });

  // Tasks
  await Promise.all([
    prisma.task.create({
      data: {
        userId: user.id,
        taskType: "Order-Related",
        assignee: "Team A",
        priorityLevel: "Critical",
        description: "Order 200 packs of butter",
        dueDate: new Date("2024-04-30"),
        location: "Warehouse 1",
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        taskType: "Stock-Related",
        assignee: "Team B",
        priorityLevel: "High",
        description: "Check expired milk units",
        dueDate: new Date("2024-04-25"),
        location: "Dairy Section",
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        taskType: "Order-Related",
        assignee: "Team C",
        priorityLevel: "Medium",
        description: "Order new grains",
        dueDate: new Date("2024-05-01"),
        location: "Warehouse 2",
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        taskType: "Stock-Related",
        assignee: "Team D",
        priorityLevel: "Low",
        description: "Reorganize aisle 4",
        dueDate: new Date("2024-05-05"),
        location: "Main Store",
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        taskType: "Stock-Related",
        assignee: "Team E",
        priorityLevel: "Critical",
        description: "Audit all cereals",
        dueDate: new Date("2024-04-28"),
        location: "Dry Goods",
      },
    }),
  ]);
}

main()
  .then(() => console.log("✅ Enhanced seed completed"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
