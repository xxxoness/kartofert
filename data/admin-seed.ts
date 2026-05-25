export const adminSeedStats = {
  newLeads: 6,
  calculations: 18,
  products: 15,
  articles: 10,
  orderSum: "160 ₽"
};

export const initialLeads = [
  {
    id: "KF-240101",
    createdAt: new Date().toISOString(),
    status: "новая" as const,
    source: "калькулятор" as const,
    name: "Расчёт с сайта",
    phone: "+375 29 000-00-00",
    email: "client@example.com",
    productName: "Комплексное NPK для картофеля",
    amount: "400 кг, 16 мешков",
    total: "160 ₽",
    city: "Минск",
    comment: "Заявка для проверки админки"
  },
  {
    id: "KF-240102",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    status: "в работе" as const,
    source: "товар" as const,
    name: "Покупатель",
    phone: "+375 33 111-22-33",
    productName: "Сульфат калия",
    amount: "120 кг, 5 мешков",
    total: "50 ₽",
    city: "Гродно",
    comment: "Уточнить доставку"
  }
];
