import React,{useState, useEffect} from 'react'
import {Row, Col, Container, Form, Button} from "react-bootstrap";
import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";
import { createPortal } from 'react-dom/cjs/react-dom.development';
import MovieList from './MovieList.js'
import MovieDetail from './MovieDetail.js'
import ActorDetail from './ActorDetail.js'
import HomeCarousel from './HomeCarousel.js'
import Filters from './Filters.js'

import toArray from 'stream-to-array'


function Home() {

    const [moviesStream, setMoviesStream] = useState([])
    const [page, setPage] = useState({
        showList:true,
        showMovie:false,
        movieID:"",
        showActor:false,
        actorID:""
    })

    const showMovie = (id) =>{
        setPage({...page,showList:false, showActor:false, showMovie:true, movieID:id})
    }

    const showActor = (id) =>{
        setPage({...page,showList:false, showActor:true, actorID:id, showMovie:false})
    }

    const showList = () =>{
        setPage({...page,showList:true, showActor:false, showMovie:false})
    }

    const getMovieID = () => {
        return page.movieID
    }

    const getActorID = () => {
        return page.actorID
    }
    

    useEffect(() => {
        getData(allMoviesQuery)
    },[])


    const getData = (query) => {
        var x = null
        fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + query).then((res) =>  x = res).then((item) =>
            toArray(item, function (err, arr) {
                setMoviesStream(arr)
            })
        ) 
    }


    const fetcher = new SparqlEndpointFetcher();

    const imageLink = "https://image.tmdb.org/t/p/w500";
  
    const RDFprefixes = `PREFIX dbo: <https://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX sm: <http://sm.org/onto/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

    const allMoviesQuery = `SELECT ?subject ?name ?picture 
        WHERE {
            ?subject rdfs:Class sm:Film; sm:hasName ?name; 
            OPTIONAL {?subject sm:hasPoster ?picture}}`;
      

    const setFilter = (data) => {
        var tempQuery = ""
        var tempString = ""

        if(data.genre.length != 0){   
            data.genre.map(item => {tempString += "?subject rdfs:Class sm:"+item+".\n"})
        }

        if(data.rating == 1){
            tempQuery =`SELECT ?subject ?name ?picture ?ranking
            WHERE {
                ?subject rdfs:Class sm:Film; sm:hasName ?name; 
                         sm:hasRanking ?ranking.
                ${tempString}
                OPTIONAL {?subject sm:hasPoster ?picture}
                FILTER regex(?name, "${data.name}", "i" ) 
            }
                ORDER BY DESC(?ranking)`
        }else if(data.rating == 2){
            tempQuery =`SELECT ?subject ?name ?picture ?ranking
            WHERE {
                ?subject rdfs:Class sm:Film; sm:hasName ?name; 
                         sm:hasRanking ?ranking.
                         ${tempString}
                OPTIONAL {?subject sm:hasPoster ?picture}
                FILTER regex(?name, "${data.name}", "i" ) }
                ORDER BY ASC(?ranking)`
        }else if(data.release == 1){
            tempQuery =`SELECT ?subject ?name ?picture ?releasedIn
            WHERE {
                ?subject rdfs:Class sm:Film; sm:hasName ?name; 
                         sm:releasedIn ?releasedIn.
                         ${tempString}
                OPTIONAL {?subject sm:hasPoster ?picture}
                FILTER regex(?name, "${data.name}", "i" ) }
                ORDER BY DESC(?releasedIn)`
        }else if(data.release == 2){
            tempQuery =`SELECT ?subject ?name ?picture ?releasedIn
            WHERE {
                ?subject rdfs:Class sm:Film; sm:hasName ?name; 
                         sm:releasedIn ?releasedIn.
                         ${tempString}
                OPTIONAL {?subject sm:hasPoster ?picture}
                FILTER regex(?name, "${data.name}", "i" ) }
                ORDER BY ASC(?releasedIn)`
        }else{
            tempQuery =`SELECT ?subject ?name ?picture 
            WHERE {
                ?subject rdfs:Class sm:Film; sm:hasName ?name. 
                ${tempString}
                OPTIONAL {?subject sm:hasPoster ?picture}
                FILTER regex(?name, "${data.name}", "i" ) }`
        }

        getData(tempQuery)
    }
    

  return (
    <Container fluid>
        {
            page.showList ?
            <Filters movies = {moviesStream} filterMovie={setFilter}></Filters>
            :
            null
        }
        {
            page.showList ? 
                <MovieList moviesStream = {moviesStream} showMovie={showMovie}></MovieList>
            :
            page.showMovie ?
            <MovieDetail getMovieID={getMovieID} showList={showList} showActor={showActor}></MovieDetail>
            :
            <ActorDetail getActorID={getActorID} showList={showList} showMovie={showMovie}></ActorDetail>
        }           
    </Container>
  );
}

export default Home;
