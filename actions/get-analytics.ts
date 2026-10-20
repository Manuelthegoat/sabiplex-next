import { db } from "@/lib/db";

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: { course: { userId } },
      include: { course: { select: { id: true, title: true } } },
    });
    const grouped = new Map<string, { name: string; totalKobo: number }>();

    purchases.forEach((purchase) => {
      const course = grouped.get(purchase.course.id) ?? {
        name: purchase.course.title,
        totalKobo: 0,
      };
      course.totalKobo += purchase.amountPaidKobo;
      grouped.set(purchase.course.id, course);
    });

    const data = Array.from(grouped.values()).map(({ name, totalKobo }) => ({
      name,
      total: totalKobo / 100,
    }));
    const totalRevenueKobo = purchases.reduce((sum, purchase) => sum + purchase.amountPaidKobo, 0);

    return {
      data,
      totalRevenue: totalRevenueKobo / 100,
      totalSales: purchases.length,
      unrecordedSales: purchases.filter((purchase) => purchase.amountPaidKobo <= 0).length,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return { data: [], totalRevenue: 0, totalSales: 0, unrecordedSales: 0 };
  }
};
