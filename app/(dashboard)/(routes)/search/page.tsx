import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { CoursesList } from "@/components/courses-list";


interface SearchPageProps {
  searchParams: {
    title: string
    categoryId: string
  }
}

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const {userId} = auth()

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId: userId ?? undefined,
    ...searchParams
  })
  return (
    <>
    <div className="page-shell px-5 pt-6 md:hidden">
      <SearchInput />
    </div>
    <div className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
      <div><p className="eyebrow">Explore</p><h1 className="mt-1 text-3xl font-black tracking-tight">Find your next skill</h1><p className="mt-2 text-slate-500">Browse courses that meet you where your curiosity starts.</p></div>
      <Categories items={categories} />
      <CoursesList items={courses} />
      </div>
    </div>
    </>
  );
};

export default SearchPage;
