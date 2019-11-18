async function getCategories(){
    const origin = window.location.origin;
    const response = await fetch(`${origin}/categories/listAll`);
    return response.json();
};

export default{
    getCategories,
}