"use client"

import { Category } from "@prisma/client"
import {
    FcBiotech,
    FcConferenceCall,
    FcEngineering,
    FcFilmReel,
    FcIdea,
    FcInspection,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcPlus,
    FcSalesPerformance,
    FcSportsMode
} from "react-icons/fc"
import { IconType } from "react-icons"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Engineering": FcEngineering,
    "Mathematics": FcIdea,
    "Medicine": FcBiotech,
    "Pharmacy": FcPlus,
    "Food": FcInspection,
    "computer science": FcMultipleDevices,
    "mass comm": FcConferenceCall,

}


export const Categories = ({items}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}