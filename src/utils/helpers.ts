/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryType } from "@/services/api/product_categorie";

export const filterCategory = (serachTerm : string , data :CategoryType)=>{
    const titleNormalized = serachTerm.normalize('NFD').replace(/[\u0300-\u036f\s()\-/,+'']/g, '');
    const titleRegex = new RegExp('.*' + titleNormalized.split(" ").join() + '.*', 'gi');
    const filtered = data.filter((item) => {
        const labelNormalized = item.label
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');
        const labelMatch = titleRegex.test(labelNormalized);
        const caracMatch = item.caracteristique_field.some((carac: { [x: string]: any[] }) => {
            if (carac && carac['enum']) {
                return carac['enum'].some((el: string) => {
                    const elNormalized = el.normalize('NFD').replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');

                    const isMatch = titleRegex.test(elNormalized);
                    return isMatch;
                });
            }
            return false;
        });
        return labelMatch || caracMatch;
    });

    return filtered
}