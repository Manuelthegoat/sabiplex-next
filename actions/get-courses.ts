import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
    category: Category | null
    chapters: {id: string} []
    progress: number|null
    reviews: {rating: number}[]
}

type GetCourses = {
    userId?: string
    title?: string
    categoryId?: string
    categoryIds?: string[]
}

export const getCourses = async ({
    userId,
    title,
    categoryId,
    categoryIds,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId: categoryIds?.length
                    ? { in: categoryIds }
                    : categoryId ? { equals: categoryId } : undefined,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: { userId: userId ?? "__anonymous__" }
                },
                reviews: { select: { rating: true } }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (!userId || course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }
                const progressPercentage = await getProgress(userId, course.id)

                return {
                    ...course,
                    progress: progressPercentage
                }
            })
        )
        return courseWithProgress
    } catch (error) {
        console.log("GET_COURSES", error)
        return []
    }
}
