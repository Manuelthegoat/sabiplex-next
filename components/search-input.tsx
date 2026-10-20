"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const SearchInput = () => {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [value, setValue] = useState(searchParams.get("title") ?? "")
    const debouncedValue = useDebounce(value)

    const currentCategoryIds = searchParams.getAll("categoryIds")
    const currentCategoryId = searchParams.get("categoryId")
    const categoryIdsKey = currentCategoryIds.join(",")

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryIds: categoryIdsKey ? categoryIdsKey.split(",") : null,
                categoryId: categoryIdsKey ? null : currentCategoryId,
                title: debouncedValue
            }
        }, {skipEmptyString: true, skipNull: true})
        router.push(url)
    }, [debouncedValue, categoryIdsKey, currentCategoryId, router, pathname])
    return (
        <div className="relative">
            <Search
                className="h-4 w-4 absolute top-3 left-3 text-slate-600"
            />
            <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
                className="w-full border-slate-200 bg-slate-100/80 pl-9 shadow-inner focus-visible:ring-neutral-400 md:w-[320px]"
                placeholder="Search courses and teachers"
            />
        </div>
    )
}
