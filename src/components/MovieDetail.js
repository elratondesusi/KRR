import React,{useState, useEffect} from 'react'
import {Container, Row, Col,Image, Tooltip, OverlayTrigger,Button,Popover,Modal} from "react-bootstrap";
import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";
import toArray from 'stream-to-array'

const MovieDetail = ({getMovieID, showList, showActor}) =>{
    const fetcher = new SparqlEndpointFetcher();
  
    const RDFprefixes = `PREFIX dbo: <https://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sm: <http://sm.org/onto/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

    const imageLink = "https://image.tmdb.org/t/p/w500";
   
    const oneMovieQueryNoGenreNoProducedBy = 
    `SELECT ?name ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedIn ?abstract ?countryName ?directorName (GROUP_CONCAT(?actorInfo;SEPARATOR=",") AS ?actors)
    WHERE {
      <${getMovieID()}> rdfs:Class sm:Film;
               sm:hasName ?name. 
      OPTIONAL {<${getMovieID()}> sm:hasPoster ?poster.}
      OPTIONAL {<${getMovieID()}>                   sm:hasBudget ?budget.}
      OPTIONAL {<${getMovieID()}>                   sm:hasHomepage ?homepage.}
      OPTIONAL {<${getMovieID()}>                   sm:hasRanking ?ranking.}
      OPTIONAL {<${getMovieID()}>                   sm:hasRuntime ?runtime.}
      OPTIONAL {<${getMovieID()}>                   sm:isAdultFilm ?adult.}
      OPTIONAL {<${getMovieID()}>                   sm:releasedIn ?releasedIn.}
      OPTIONAL {<${getMovieID()}>                   sm:hasAbstract ?abstract.}
      OPTIONAL {<${getMovieID()}>                   sm:directedBy ?directedBy.
      OPTIONAL {      ?directedBy sm:hasName ?directorName.}}
      OPTIONAL {<${getMovieID()}>                   sm:hasOriginCountry ?country.
      OPTIONAL {      ?country sm:hasName ?countryName.}}
      OPTIONAL {<${getMovieID()}>                   sm:starring ?starring.
      OPTIONAL {      ?starring sm:hasName ?actorName.
        BIND (CONCAT(STR(?starring), " - ", ?actorName) AS ?actorInfo)}}   
    }
    GROUP BY ?name ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedIn ?abstract ?countryName ?directorName`;
    
    const filmStudioQuery = `SELECT ?name ?logo ?countryName
    WHERE {
        <${getMovieID()}> dbo:ProducedBy ?studio. 
        ?studio sm:hasName ?name;
     OPTIONAL{?studio sm:hasLogo ?logo;
        sm:hasOriginCountry ?country.
        ?country sm:hasName ?countryName}
    }`;
   
    const filmGenreQuery = `SELECT ?genre 
    WHERE {
      <${getMovieID()}> rdfs:Class ?genre. 
      FILTER (?genre != sm:Film)
    }`;


    const [movie, setMovie] = useState({detail:[],studio:[],genres:[]})


    useEffect(() => {
        var x1 = fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + oneMovieQueryNoGenreNoProducedBy)
        var x2 = fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + filmStudioQuery)
        var x3 = fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + filmGenreQuery)
        
        Promise.all([x1,x2,x3]).then(
            ([res1, res2, res3]) => (          
                toArray(res1, function (err, arr) {
                }).then((item1) => ( toArray(res2, function (err, arr) {
                    }).then((item2) => ( toArray(res3, function (err, arr) {
                        }).then((item3) => (setMovie({detail:item1, studio:item2, genres:item3})))))))))    
    },[])
    
    const renderGenre = (item) => {
        console.log(item)
        var tempArr = item.genre.value.split("/")
        var name = tempArr[tempArr.length - 1]
        return (
            <span>{name} </span>
        )   
    }

    const renderActor = (item) => {
        var tempArr = item.split(" - ")
        return (
            <Button id={tempArr[0]} style={{padding: "0",fontSize:"0.9em"}} variant="link" onClick={()=>showActor(tempArr[0])}>{tempArr[1]}&nbsp;&nbsp;</Button>  
        )   
    }

    const renderStudio = (item) => {
        var name = item.name.value
        var logo = ""
        var countryName = ""
        if(item.logo){
            logo = item.logo.value
        }
        if(item.countryName){
            countryName = item.countryName.value
        }
        return (
            <div>
            <OverlayTrigger key={item.name.value} placement="top"
                overlay={
                    <Popover id={item.name.value}>
                    <Popover.Title as="h3">{item.name.value}</Popover.Title>
                    <Popover.Content>
                        {
                            logo == "" ? 
                            null
                            :
                            <Image src={"https://image.tmdb.org/t/p/w200" +  logo} fluid rounded />
                        }
                        {
                            countryName == "" ?
                            null
                            :
                            <p style={{marginTop: "4%"}}><span style={{fontWeight: "bold"}}>Country: </span> {countryName}</p>
                        }
                    </Popover.Content>
                    </Popover>
                }
                >
                <Button style={{padding: "0",fontSize:"0.9em", backgroundColor:"white", border:"0", color:"black", textDecoration:"underline"}}>{item.name? item.name.value : null}</Button> 
            </OverlayTrigger>  
            &nbsp;&nbsp;
            </div>
        )   
    }


    if(movie.detail.length === 0){
        return (null)
    }else{
        var actorArr = []
        var budget = ""
        var homepage = ""
        var ranking = ""
        var runtime = ""
        var adult = ""
        var releasedIn = ""
        var abstract = ""
        var starring = ""
        var countryName = ""
        var directorName = ""
        var poster = ""

        if(movie.detail[0].actors){
            actorArr = movie.detail[0].actors.value.split(",")
        }
        if(movie.detail[0].budget){
            budget = movie.detail[0].budget.value
        }if(movie.detail[0].homepage){
            homepage = movie.detail[0].homepage.value
        }if(movie.detail[0].ranking){
            ranking = movie.detail[0].ranking.value
        }if(movie.detail[0].runtime){
            runtime = movie.detail[0].runtime.value
        }if(movie.detail[0].adult){
            adult = movie.detail[0].adult.value
        }if(movie.detail[0].releasedIn){
            releasedIn = movie.detail[0].releasedIn.value
        }if(movie.detail[0].abstract){
            abstract = movie.detail[0].abstract.value
        }if(movie.detail[0].starring){
            starring = movie.detail[0].starring.value
        }if(movie.detail[0].countryName){
            countryName = movie.detail[0].countryName.value
        }if(movie.detail[0].directorName){
            directorName = movie.detail[0].directorName.value
        }if(movie.detail[0].poster){
            poster = movie.detail[0].poster.value
        }

    return (

        <Container style={{textAlign: 'left'}}>
            <Row>
                <Button variant="outline-dark" style={{marginTop:"2.5%"}} onClick={showList}>
                    Back to Movies
                </Button>
            </Row>
            <h1 style={{marginTop:"2.5%", fontSize:"4em", fontWeight:"bolder"}}>{movie.detail[0].name.value}</h1>
            <p style={{marginLeft:"3%", fontSize:"1.5em", color: "grey"}}>
                {movie.genres.map((item,i) => renderGenre(item))}
                &#9900;&nbsp;
                {runtime} min.
            </p>
            <p style={{fontSize:"1.2em",marginBottom: "2%"}}>            
                {abstract}            
            </p>
            <Row style={{marginBottom:"2%"}}>
            <Col>
            <Image src={"https://image.tmdb.org/t/p/w500" + poster} rounded />
            </Col>            
            <Col  style={{marginLeft:"2%", marginTop:"2%", fontSize:"1.5em"}}>
                <p><span style={{fontWeight: "bold"}}>Country: </span>{countryName}</p>
                <p><span style={{fontWeight: "bold"}}>Released in: </span>{releasedIn}</p>
                <p><span style={{fontWeight: "bold"}}>Adult movie: </span>{adult}</p>
                <p><span style={{fontWeight: "bold"}}>Director: </span>{directorName}</p>
                <p><span style={{fontWeight: "bold"}}>Actors: </span>
                {
                    actorArr && actorArr.map((item,i) => renderActor(item))
                }
                </p>
                <p><span style={{fontWeight: "bold"}}>Film studio: </span> 
                {
                    movie.studio && movie.studio.map((item,i) => renderStudio(item))
                }

                </p>
                <p><span style={{fontWeight: "bold"}}>Budget: </span> {budget}</p>
                <p><span style={{fontWeight: "bold"}}>Ranking: </span> {ranking}</p>
                <p>
                    <span style={{fontWeight: "bold"}}>Homepage: </span><a href={homepage}>{homepage}</a>
                </p>
            </Col>
            </Row>
        </Container>
    );}
   
    
}

export default MovieDetail;
 
 


