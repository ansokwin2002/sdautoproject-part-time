import { products } from "@/lib/products";

export const getNavLinks = () => {
  const allBrands = Array.from(new Set(products.map(product => product.brand)));
  const brandsToRemove = ["Mitsubishi Parts", "Nissan Parts", "Porsche Parts", "Ram Parts", "Subaru Parts", "GMC Parts", "Isuzu Parts"];
  const uniqueBrands = allBrands.filter(brand => !brandsToRemove.includes(brand)).sort();

  const brandDropdownItems = uniqueBrands.map(brand => ({
    href: `/genuine-parts?brand=${encodeURIComponent(brand)}`,
    label: brand,
  }));

  return [
    {
      href: "/genuine-parts",
      label: "Genuines Parts and Accessories",
      hasDropdown: true,
      dropdownItems: [
        { href: "/genuine-parts", label: "All Parts and Accessories" },
        { href: "/genuine-parts?brand=Ford", label: "Ford Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Isuzu", label: "Isuzu Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Toyota", label: "Toyota Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Mazda", label: "Mazda Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Mitsubishi", label: "Mitsubishi Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Nissan", label: "Nissan Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Honda", label: "Honda Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Suzuki", label: "Suzuki Genuine Parts and Accessories" },
        { href: "/genuine-parts?view=aftermarket", label: "Aftermarket Parts and Accessories" },
      ],
    },
    { href: "/home", label: "Home" },
    { href: "/policy", label: "Policy" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/contact", label: "Contact Us" },
  ];
};
