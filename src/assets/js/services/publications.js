async function getPublications(minSize, maxSize, minPrice, maxPrice, minDistance, maxDistance, category){
    const origin = window.location.origin;
    const response = await fetch(`${origin}/publications/filters/${minSize}/${maxSize}/${minPrice}/${maxPrice}/${minDistance}/${maxDistance}/${category}`);
    return response.json();
};

export default{
    getPublications,
}