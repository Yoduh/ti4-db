export function useGetImage() {
  function getImage(type: string, id: number, index: number | null = null) {
    const ext =
      type.startsWith('sheet') || type === 'components' ? '.jpg' : '.webp';
    // nomad
    if (id === 22 && type === 'agent' && index !== null) {
      type = type + ++index;
    }
    // keleres
    else if (id === 25 && type === 'hero' && index !== null) {
      type = type + ++index;
    }
    return `${process.env.API_URL}/images/${id}/${type + ext}`;
  }

  function getUnitImage(type: string, subtype: string, name: string) {
    let genericName = name.split(' II')[0];
    if (subtype) genericName = subtype.split(' II')[0];
    else if (type === 'Mech' || type === 'Flagship') genericName = type;
    return `${process.env.API_URL}/images/units/${genericName}.png`;
  }

  return { getImage, getUnitImage };
}
