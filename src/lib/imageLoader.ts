import { Biome, SubBiome } from '@/types/biome';

// Images Pixabay pour les biomes
const biomeImages: Record<string, string> = {
  'forets': 'https://cdn.pixabay.com/photo/2019/10/10/14/52/forest-4539730_1280.jpg',
  'prairies-savanes': 'https://cdn.pixabay.com/photo/2017/12/19/22/09/prairie-3028804_1280.jpg',
  'regions-froides': 'https://cdn.pixabay.com/photo/2012/10/26/03/14/siberia-63182_1280.jpg',
  'deserts': 'https://cdn.pixabay.com/photo/2021/10/30/17/54/desert-6755127_1280.jpg',
  'ecosystemes-aquatiques': 'https://cdn.pixabay.com/photo/2014/06/30/08/02/zitronenfalter-fish-380037_1280.jpg',
  'montagnes': 'https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_1280.jpg'
};

// Images Pixabay pour les sous-biomes
const subBiomeImages: Record<string, string> = {
  'foret-tropicale-humide': 'https://cdn.pixabay.com/photo/2018/01/30/22/48/rainforest-3119822_1280.jpg',
  'foret-tropicale-seche': 'https://cdn.pixabay.com/photo/2019/08/14/01/27/forest-4404497_1280.jpg',
  'foret-temperee': 'https://cdn.pixabay.com/photo/2017/11/12/13/37/forest-2942477_1280.jpg',
  'foret-boreale-taiga': 'https://cdn.pixabay.com/photo/2022/08/28/08/23/taiga-7415960_1280.jpg',
  'savane-tropicale': 'https://cdn.pixabay.com/photo/2019/04/12/11/46/antelope-4121962_1280.jpg',
  'prairie-temperee': 'https://cdn.pixabay.com/photo/2020/07/18/23/00/grassland-5418516_1280.jpg',
  'toundra-arctique': 'https://cdn.pixabay.com/photo/2021/08/26/18/31/road-6576857_1280.jpg',
  'toundra-alpine': 'https://cdn.pixabay.com/photo/2020/07/01/12/59/mountains-5359560_1280.jpg',
  'desert-chaud': 'https://cdn.pixabay.com/photo/2021/10/30/17/54/desert-6755127_1280.jpg',
  'desert-froid': 'https://cdn.pixabay.com/photo/2019/11/10/15/57/chile-4616138_1280.jpg',
  'eaux-douces-lacs-etangs': 'https://cdn.pixabay.com/photo/2023/06/13/05/43/reflection-8060005_1280.jpg',
  'eaux-douces-rivieres-fleuves': 'https://cdn.pixabay.com/photo/2023/01/11/15/39/river-7712017_1280.jpg',
  'eaux-douces-marais-zones-humides': 'https://cdn.pixabay.com/photo/2014/05/27/00/52/swamp-355057_1280.jpg',
  'marin-cotes-peu-profond': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1280&h=800&fit=crop&crop=center',
  'marin-oceans-ouverts': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&h=800&fit=crop&crop=center',
  'marin-fonds-benthiques': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1280&h=800&fit=crop&crop=center',
  'piedmonts-boises': 'https://cdn.pixabay.com/photo/2018/08/21/23/29/forest-3622519_1280.jpg',
  'forets-montagnardes': 'https://images.unsplash.com/photo-1599168215926-ebe820046d54?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'zones-alpines': 'https://images.unsplash.com/photo-1627414365154-5757e8ba4bdd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'glaciers-neiges-eternelles': 'https://images.unsplash.com/photo-1440631194798-e78809f62275?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

/**
 * Charge les images depuis images.json et les associe aux biomes
 */
export function loadBiomesWithImages(biomesData: Biome[]): Biome[] {
  return biomesData.map(biome => ({
    ...biome,
    image: biomeImages[biome.id],
    subBiomes: biome.subBiomes.map(subBiome => ({
      ...subBiome,
      image: subBiomeImages[subBiome.id]
    }))
  }));
}

/**
 * Obtient l'URL d'image pour un biome spécifique
 */
export function getBiomeImage(biomeId: string): string | undefined {
  return biomeImages[biomeId];
}

/**
 * Obtient l'URL d'image pour un sous-biome spécifique
 */
export function getSubBiomeImage(subBiomeId: string): string | undefined {
  return subBiomeImages[subBiomeId];
}