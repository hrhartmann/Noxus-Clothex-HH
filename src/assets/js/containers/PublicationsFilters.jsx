import React, { Component } from 'react';
import publicationsServices from '../services/publications';
import categoriesServices from '../services/categories';
import PublicationComponent from '../components/Publications';

export default class Publication extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            publications: [],
            allPublications: [],
            categories: [],
            category: "all",
            minSize: "all",
            maxSize: "all",
            minPrice: "all",
            maxPrice: "all",
            minDistance: "all",
            maxDistance: "all",
            userBool: props.serverData.currentuserbool,
            currentUserId: props.serverData.currentuserid,
            currentUserCategory: props.serverData.currentusercategory,
            currentUserLong: parseFloat(props.serverData.cuserlong),
            currentUserlat: parseFloat(props.serverData.cuserlat),
        }
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeDistance = this.onChangeDistance.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeSize = this.onChangeSize.bind(this);
        this.getFiltredPublications = this.getFiltredPublications.bind(this);
        this.maxFilter = this.maxFilter.bind(this);
        this.getCategories= this.getCategories.bind(this);
    }

    componentDidMount(){
        const { category } = this.state;
        const { minSize } = this.state;
        const { maxSize } = this.state;
        const { minPrice } = this.state;
        const { maxPrice } = this.state;
        const { minDistance } = this.state;
        const { maxDistance } = this.state;
        this.getFiltredPublications(`${minSize}`, `${maxSize}`, `${minPrice}`, `${maxPrice}`, `${minDistance}`, `${maxDistance}`, `${category}`);
        this.getCategories();
    }

    async getFiltredPublications(minSize, maxSize, minPrice, maxPrice, minDistance, maxDistance, category) {
        this.setState({ loading: true });
        const publications = await publicationsServices.getPublications(minSize, maxSize, minPrice, maxPrice, minDistance, maxDistance, category);
        this.setState({ allPublications: publications });
        this.setState({ publications: publications, loading: false });
    }

    async getCategories(){
        const categories = await categoriesServices.getCategories();
        this.setState({ categories: categories})
    }

    async maxFilter(functionEvent, type){
        function filterByCat(publication){
            if (functionEvent.target.value == "all"){
                return true
            } else {
                return publication.category === Number(functionEvent.target.value)
            }
        }
        function filterByPrice(publication){
            let minPrice = functionEvent.target.value.split("-")[0];
            let maxPrice = functionEvent.target.value.split("-")[1];
            if (minPrice === "all") {
                return true
            } else if (maxPrice !== 0){
                return (Number(publication.price) >= Number(minPrice) && Number(publication.price) <= Number(maxPrice))
            } else {
                return (Number(publication.price) >= minPrice)
            }      
        }
        function filterBySize(publication){
            if (functionEvent.target.value !=="none"){
                let minSize = Number(functionEvent.target.value.split("-")[0]);
                let maxSize = Number(functionEvent.target.value.split("-")[1]);
                if (maxSize !== 0){
                    return (Number(publication.size) >= minSize && Number(publication.Size) <= maxSize)
                } else {
                    return (Number(publication.size) >= minSize)
                }
            } else {
                return (publication.size === null)
            }     
        }
        function filterByDistance(publication){
            let distance = "none"
            if (this.state.userBool === "true"){
                distance = "none"
            } else {
                const clat = this.state.currentUserlat * Number("110574");
                const olat = publication.lat * Number("110574");
                const clong = Math.cos(this.state.currentUserLong) * Number("111320");
                const olong =  Math.cos(publication.long) * Number("111320");
                if (Math.pow(clat-olat,2) + Math.pow(clong-olong,2) != 0){
                    distance = Math.pow(Math.pow(clat-olat,2) + Math.pow(clong-olong,2),0.5)
                } else {
                    distance = 0
                }
            }
            if (functionEvent.target.value !=="none"){
                let minDistance = Number(functionEvent.target.value.split("-")[0]);
                let maxDistance = Number(functionEvent.target.value.split("-")[1]);
                if (maxDistance !== 0){
                    return (distance >= minDistance && distance <= maxDistance)
                } else {
                    return (distance >= minDistance)
                }
            } else {
                return (distance === "none")
            }
        }
        function nonEventFilterByCategory(publication){
            if (this.state.category === "all"){
                return true
            } else {
                return publication.category === Number(this.state.category)
            }
        }
        function nonEventFilterBySize(publication){
            if (this.state.minSize === "all"){
                return true
            } else if(this.state.minSize === "none"){
                return (publication.size === null)
            } else {
                let minPrice = Number(this.state.minSize);
                let maxPrice = Number(this.state.maxSize);
                if (maxPrice !== 0){
                    return (Number(publication.price) >= minPrice && Number(publication.price) <= maxPrice)
                } else {
                    return (Number(publication.price) >= minPrice)
                } 
            }
        }
        function nonEventFilterByPrice(publication){
            let minPrice = this.state.minPrice;
            let maxPrice = this.state.maxPrice;
            if (minPrice === "all"){
                return true
            } else if (maxPrice !== 0){
                return (Number(publication.price) >= Number(minPrice) && Number(publication.price) <= Number(maxPrice))
            } else {
                return (Number(publication.price) >= minPrice)
            }
        }
        function nonEventFilterByDistance(publication){
            if (this.state.minDistance === "all"){
                return true
            } else {
                let distance = "none"
                if (this.state.userBool === "true"){
                    distance = "none"
                } else {
                    const clat = this.state.currentUserlat * Number("110574");
                    const olat = publication.lat * Number("110574");
                    const clong = Math.cos(this.state.currentUserLong) * Number("111320");
                    const olong =  Math.cos(publication.long) * Number("111320");
                    if (Math.pow(clat-olat,2) + Math.pow(clong-olong,2) != 0){
                        distance = Math.pow(Math.pow(clat-olat,2) + Math.pow(clong-olong,2),0.5)
                    } else {
                        distance = 0
                    }
                }
                if (this.state.minDistance !=="none"){
                    let minDistance = Number(this.state.minDistance);
                    let maxDistance = Number(this.state.maxDistance);
                    if (maxDistance !== 0){
                        return (distance >= minDistance && distance <= maxDistance)
                    } else {
                        return (distance >= minDistance)
                    }
                } else {
                    return (distance === "none")
                }
            }
        }
        if (type === "category"){
            this.setState({ category: functionEvent.target.value})
            if (functionEvent.target.value !== "all"){
                let pubs = this.state.allPublications.filter(filterByCat);
                pubs = pubs.filter(nonEventFilterByPrice, this);
                pubs = pubs.filter(nonEventFilterByDistance, this);
                pubs = pubs.filter(nonEventFilterBySize, this);
                this.setState({publications: pubs})
            } else {
                let pubs = this.state.allPublications.filter(nonEventFilterByPrice, this)
                pubs = pubs.filter(nonEventFilterByDistance, this);
                pubs = pubs.filter(nonEventFilterBySize, this);
                this.setState({publications: pubs})
            }
        } else if (type == "price"){
            if (functionEvent.target.value !== "all"){
                this.setState({minPrice: functionEvent.target.value.split("-")[0]})
                this.setState({maxPrice: functionEvent.target.value.split("-")[1]})
                let pubs = this.state.allPublications.filter(filterByPrice)
                pubs = pubs.filter(nonEventFilterByCategory, this)
                pubs = pubs.filter(nonEventFilterByDistance, this)
                pubs = pubs.filter(nonEventFilterBySize, this);
                this.setState({publications: pubs})
            } else {
                this.setState({minPrice: "all"})
                this.setState({maxPrice: "all"})
                let pubs = this.state.allPublications.filter(nonEventFilterByCategory, this)
                pubs = pubs.filter(nonEventFilterBySize, this);
                pubs = pubs.filter(nonEventFilterByDistance, this)
                this.setState({publications: pubs})
            }
        } else if (type === "size"){
            if (functionEvent.target.value !== "all" && functionEvent.target.value !== "none"){
                this.setState({minSize: functionEvent.target.value.split("-")[0]});
                this.setState({maxSize: functionEvent.target.value.split("-")[1]});
                let pubs = this.state.allPublications.filter(filterBySize);
                pubs = pubs.filter(nonEventFilterByPrice, this);
                pubs = pubs.filter(nonEventFilterByDistance, this);
                pubs = pubs.filter(nonEventFilterByCategory, this);
                this.setState({publications: pubs});
            } else{
                if (functionEvent.target.value === "none"){
                    this.setState({minSize: "none"});
                    this.setState({maxSize: "none"});
                    let pubs = this.state.allPublications.filter(filterBySize);
                    pubs = pubs.filter(nonEventFilterByPrice, this);
                    pubs = pubs.filter(nonEventFilterByDistance, this);
                    pubs = pubs.filter(nonEventFilterByCategory, this);
                    this.setState({publications: pubs});
                } else {
                    this.setState({minSize: "all"});
                    this.setState({maxSize: "all"});
                    let pubs = this.state.allPublications.filter(nonEventFilterByPrice, this);
                    pubs = pubs.filter(nonEventFilterByDistance, this);
                    pubs = pubs.filter(nonEventFilterByCategory, this);
                    this.setState({publications: pubs});
                }
            }
        } else if (type === "distance") {
            if (functionEvent.target.value !== "all" && functionEvent.target.value !== "none"){
                this.setState({minDistance: functionEvent.target.value.split("-")[0]});
                this.setState({maxDistance: functionEvent.target.value.split("-")[1]});
                let pubs = this.state.allPublications.filter(filterByDistance, this)
                pubs = pubs.filter(nonEventFilterByCategory, this)
                pubs = pubs.filter(nonEventFilterBySize, this);
                pubs = pubs.filter(nonEventFilterByPrice, this)
                this.setState({publications: pubs})
            } else {
                if (functionEvent.target.value === "none"){
                    this.setState({minDistance: "none"});
                    this.setState({maxDistance: "none"});
                    let pubs = this.state.allPublications.filter(filterByDistance, this)
                    pubs = pubs.filter(nonEventFilterByCategory, this)
                    pubs = pubs.filter(nonEventFilterByPrice, this)
                    pubs = pubs.filter(nonEventFilterBySize, this);
                    this.setState({publications: pubs})
                } else {
                    this.setState({minDistance: "all"});
                    this.setState({maxDistance: "all"});
                    let pubs = this.state.allPublications.filter(nonEventFilterByCategory, this)
                    pubs = pubs.filter(nonEventFilterByPrice, this)
                    pubs = pubs.filter(nonEventFilterBySize, this);
                    this.setState({publications: pubs})
                }
            }   
        }
    }
    async onChangeCategory(event){
        this.maxFilter(event, "category")
    }

    async onChangePrice(event){
        this.maxFilter(event, "price")
    }

    async onChangeSize(event){
        this.maxFilter(event, "size")
    }

    async onChangeDistance(event){
        this.maxFilter(event, "distance")
    }   

    render(){
        if (this.state.loading) {
            return <p>Loading... </p>
        } else if (this.state.allPublications.length === 0){
            return <p>No results</p>
        }
        const { publications } = this.state;
        const { categories} = this.state;
        const { userBool } = this.state;
        const {currentUserId} = this.state;
        const {currentUserCategory} = this.state;
        return(
            <div>
                <div id= 'filter'>
                    <div className="category-filter" value = {this.state.category} onChange={this.onChangeCategory}>
                        <h3>Category:</h3>
                        <select >
                            <option value="all"> All </option>
                            {categories.map((item) => {
                                return <option value={item.id} > {item.name} </option>
                            }
                            )}
                        </select>
                    </div>
                    <div className="size-filter" onChange={this.onChangeSize}>
                        <h3>Size:</h3>
                        <select id="filterIds">
                            <option value="all" >All</option>
                            <option value="none" >None</option>
                            <option value="0-10" >0-10</option>
                            <option value="11-20">11-20</option>
                            <option value="21-30">21-30</option>
                            <option value="31-40">31-40</option>
                            <option value="41-50">41-50</option>
                            <option value="51-">51-</option>
                        </select>
                    </div>
                    <div className="price-filter" onChange={this.onChangePrice}>
                        <h3>Price:</h3>
                        <select id="filterIds">
                            <option value="all">All</option>
                            <option value="0-10000">0-10.000</option>
                            <option value="10001-20000">10.001-20.000</option>
                            <option value="20001-30000">20.001-30.000</option>
                            <option value="30001-40000">30.001-40.000</option>
                            <option value="40001-50000">40.001-50.000</option>
                            <option value="50001-100000">50.001-100.000</option>
                            <option value="100001-200000">100.001-200.000</option>
                            <option value="200001-">200.001-</option>
                        </select>
                    </div>
                    <div className="distance-filter" onChange={this.onChangeDistance} >
                        <h3>Distance:</h3>
                        <select id="filterIds">
                            <option value="all">All</option>
                            <option value="none">None</option>
                            <option value="0-1">0-1km</option>
                            <option value="2-5">2km-5km</option>
                            <option value="6-10">6km-10km</option>
                            <option value="11-50">11km-50km</option>
                            <option value="51-100">51km-100km</option>
                            <option value="101-">101k-</option>
                        </select>
                    </div>
                </div>
                <div className="publicationsList">
                    {publications.map((x) => <PublicationComponent title={x.title} productName={x.productName} description={x.description} image={x.image} userName={x.userName} userId={x.userId.toString()} createdAt={x.createdAt} id={x.id.toString()} price={x.price.toString()} userBool={userBool} currentUserId={currentUserId} currentUserCategory={currentUserCategory} />)}
                </div>
            </div>
        );
    }
}