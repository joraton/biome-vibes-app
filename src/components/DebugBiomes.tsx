import biomesDataRaw from "../data/biomes.json";
interface Biome {
  id: string;
  nom: string;
  image?: string;
  subBiomes: {
    id: string;
    nom: string;
    image?: string;
  }[];
}

const biomesData = biomesDataRaw as Biome[];

export const DebugBiomes = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h2>Debug: Données des biomes</h2>
      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
        {JSON.stringify(biomesData, null, 2)}
      </pre>
      
      <h3>Résumé des images:</h3>
      {biomesData.map((biome) => (
        <div key={biome.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
          <strong>{biome.nom}</strong> (ID: {biome.id})
          <br />
          Image: {biome.image ? '✅ ' + biome.image : '❌ Non définie'}
          <br />
          Sous-biomes:
          <ul>
            {biome.subBiomes.map((sub) => (
              <li key={sub.id}>
                {sub.nom} - Image: {sub.image ? '✅ ' + sub.image : '❌ Non définie'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};