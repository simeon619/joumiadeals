/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryType } from "@/services/api/product_categorie";

export const filterCategory = (searchTerm: string, data: CategoryType) => {
    const searchTerms = searchTerm
      .normalize('NFD')
      .replace(/[\u0300-\u036f\s()\-/,+'']/g, '')
      .split(/\s+/);
  
    const titleRegexes = searchTerms.map(term => new RegExp('.*' + term + '.*', 'gi'));
  
    const filtered = data.filter(item => {
      const labelNormalized = item.label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');
  
      const labelMatch = titleRegexes.some(regex => regex.test(labelNormalized));
  
      const caracMatch = item.caracteristique_field.some(carac => {
        if (carac && carac['enum']) {
          return carac['enum'].some(el => {
            const elNormalized = el.normalize('NFD').replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');
            return titleRegexes.some(regex => regex.test(elNormalized));
          });
        }
        return false;
      });
  
      return labelMatch || caracMatch;
    });
  
    return filtered;
  };