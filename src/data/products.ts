import { Product } from "@/types/product"

export const products: Product[] = [
    {
      id: "1",
      name: "Performance Spark Plug Set",
      brand: "Ford",
      model: "Mustang",
      category: "Engine",
      price: "$45",
      image: "https://picsum.photos/seed/sparkplug/400/200",
      description: "High-performance iridium spark plugs for improved ignition and fuel efficiency. Compatible with Ford Mustang 5.0L V8 engines.",
      rating: 4.5,
      reviews: 100,
      options: [
        {
          name: "color",
          options: ["red", "blue", "green"]
        },
        {
          name: "size",
          options: ["small", "medium", "large"]
        },
      ],
    },
    {
      id: "2",
      name: "Premium Shock Absorber Kit",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "Suspension",
      price: "$280",
      image: "https://picsum.photos/seed/shock/400/200",
      description: "Heavy-duty shock absorbers designed for Mercedes-Benz G-Class. Provides superior ride comfort and handling.",
      rating: 4.7,
      reviews: 80,
      options: [
        {
          name: "material",
          options: ["heavy-duty", "standard"]
        }
      ]
    },
    {
      id: "3",
      name: "Sport Steering Wheel",
      brand: "Ford",
      model: "Focus",
      category: "Interior",
      price: "$320",
      image: "https://picsum.photos/seed/steering/400/200",
      description: "Premium leather sport steering wheel with paddle shifters. Direct fit for Ford Focus ST models.",
      rating: 4.6,
      reviews: 90,
      options: [
        {
          name: "material",
          options: ["leather", "alcantara"]
        }
      ]
    },
    {
      id: "4",
      name: "High-Flow Air Filter",
      brand: "Ford",
      model: "Mustang",
      category: "Engine",
      price: "$65",
      image: "https://picsum.photos/seed/airfilter/400/200",
      description: "Performance air filter for Ford Mustang. Increases airflow and engine power while maintaining filtration efficiency.",
      rating: 4.4,
      reviews: 75,
      options: [
        {
          name: "type",
          options: ["standard", "high-performance"]
        }
      ]
    },
    {
      id: "5",
      name: "Leather Seat Cover Set",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "Interior",
      price: "$450",
      image: "https://picsum.photos/seed/seatcover/400/200",
      description: "Premium leather seat covers designed specifically for Mercedes-Benz G-Class. Includes front and rear seats.",
      rating: 4.8,
      reviews: 60,
      options: [
        {
          name: "material",
          options: ["leather", "vinyl"]
        }
      ]
    },
    {
      id: "6",
      name: "Performance Coil Spring Set",
      brand: "Ford",
      model: "Focus",
      category: "Suspension",
      price: "$180",
      image: "https://picsum.photos/seed/spring/400/200",
      description: "Lowering springs for Ford Focus. Improves handling and gives a sportier stance.",
      rating: 4.3,
      reviews: 50,
      options: [
        {
          name: "drop",
          options: ["1 inch", "1.5 inch", "2 inch"]
        }
      ]
    },
    {
      id: "7",
      name: "Brake Pad Set",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "Brakes",
      price: "$120",
      image: "https://picsum.photos/seed/brakepad/400/200",
      description: "Ceramic brake pads for Mercedes-Benz G-Class. Provides excellent stopping power and low dust.",
      rating: 4.9,
      reviews: 40,
      options: [
        {
          name: "material",
          options: ["ceramic", "semi-metallic"]
        }
      ]
    },
    {
      id: "8",
      name: "Performance Exhaust System",
      brand: "Ford",
      model: "Mustang",
      category: "Exhaust",
      price: "$850",
      image: "https://picsum.photos/seed/exhaust/400/200",
      description: "Stainless steel cat-back exhaust system for Ford Mustang. Increases power and provides an aggressive sound.",
      rating: 4.7,
      reviews: 30,
      options: [
        {
          name: "tip",
          options: ["single", "dual", "quad"]
        },
        {
          name: "material",
          options: ["stainless", "titanium"]
        }
      ]
    }
  ];