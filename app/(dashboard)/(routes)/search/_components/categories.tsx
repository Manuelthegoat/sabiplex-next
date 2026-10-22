"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Check, ChevronDown, ListFilter, X } from "lucide-react";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CategoriesProps {
    items: Category[]
}

export const Categories = ({ items }: CategoriesProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedIds = searchParams.getAll("categoryIds");
    const legacyCategoryId = searchParams.get("categoryId");
    const selected = new Set(selectedIds.length ? selectedIds : legacyCategoryId ? [legacyCategoryId] : []);

    const updateSelection = (categoryId: string, checked: boolean) => {
        const next = new Set(selected);
        if (checked) next.add(categoryId);
        else next.delete(categoryId);
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: searchParams.get("title"),
                categoryIds: Array.from(next),
                categoryId: null,
            },
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    };

    const clearSelection = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: { title: searchParams.get("title"), categoryIds: null, categoryId: null },
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="gap-2">
                    <ListFilter className="h-4 w-4" />
                    Categories
                    {selected.size > 0 && <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">{selected.size}</span>}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(24rem,calc(100vw-2rem))] p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div><p className="font-semibold">Filter by category</p><p className="text-xs text-slate-500">Choose one or more categories</p></div>
                    {selected.size > 0 && <Button type="button" variant="ghost" size="sm" onClick={clearSelection} className="h-8 gap-1 px-2 text-xs"><X className="h-3.5 w-3.5" />Clear</Button>}
                </div>
                <div className="max-h-72 overflow-y-auto p-2">
                    {items.map((item) => {
                        const isSelected = selected.has(item.id);
                        return <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-slate-100">
                            <Checkbox checked={isSelected} onCheckedChange={(checked) => updateSelection(item.id, checked === true)} />
                            <span className="flex-1">{item.name}</span>
                            {isSelected && <Check className="h-4 w-4 text-neutral-700" />}
                        </label>;
                    })}
                    {!items.length && <p className="p-3 text-sm text-slate-500">No categories available.</p>}
                </div>
            </PopoverContent>
        </Popover>
    );
};
