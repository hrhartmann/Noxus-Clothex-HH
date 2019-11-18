async function getTrades(tradesType){
    const origin = window.location.origin;
    const response = await fetch(`${origin}/trades/allTrades`);
    return response.json();
};

export default{
    getTrades,
}