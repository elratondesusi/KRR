import React, {useState, useEffect} from 'react'
import {Container, Row, Col,Image,Button} from "react-bootstrap";
import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";
import toArray from 'stream-to-array'

function ActorDetail({showList, showMovie, getActorID}) {
    const fetcher = new SparqlEndpointFetcher();
  
    const RDFprefixes = `PREFIX dbo: <https://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sm: <http://sm.org/onto/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

    const imageLink = "https://image.tmdb.org/t/p/w500";

    const filmsByActor = `SELECT ?photo ?actorName ?birthDate ?deathDate ?popularity ?birthPlace ?biography (GROUP_CONCAT(?movie;SEPARATOR=",") AS ?movies)
    WHERE {
          <${getActorID()}> rdfs:Class sm:Actor;
                                              sm:starsIn ?Film. 
          OPTIONAL {<${getActorID()}> sm:hasPhoto ?photo.           }
          OPTIONAL {<${getActorID()}> sm:hasName ?actorName.        }
          OPTIONAL {<${getActorID()}> sm:hasBirthDate ?birthDate.   }
          OPTIONAL {<${getActorID()}> sm:hasDeathDate ?deathDate.   }  
          OPTIONAL {<${getActorID()}> sm:hasPopularity ?popularity. }     
          OPTIONAL {<${getActorID()}> sm:hasBirthPlace ?birthPlace. }        
          OPTIONAL {<${getActorID()}> sm:hasBiography ?biography.   }   
          ?Film sm:hasName ?filmName.     

    BIND (CONCAT(STR(?Film), " - ", ?filmName) AS ?movie)
    }
    GROUP BY  ?photo ?actorName ?birthDate ?deathDate ?popularity ?birthPlace ?biography ?movies`;
   
    const [actor, setActor] = useState()

    useEffect(() => {
      fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + filmsByActor).then((item) =>
      toArray(item, function (err, arr) {
        setActor(arr[0])
      }))
    },[])
    
    const renderMovie = (item) => {
      var tempArr = item.split(" - ")
      return (
          <Button id={tempArr[0]} style={{padding: "0",fontSize:"0.9em"}} variant="link" onClick={()=>showMovie(tempArr[0])}>{tempArr[1]}&nbsp;&nbsp;</Button>  
      )   
  }

    if(!actor){
      return (null)
    }else{
      var photo = ""
      var actorName = ""
      var birthDate = ""
      var deathDate = ""
      var popularity = ""  
      var birthPlace = ""     
      var biography = ""

      if(actor.photo){
        photo = actor.photo.value
      }
      if(actor.actorName){
        actorName = actor.actorName.value
      }
      if(actor.birthDate){
        birthDate = actor.birthDate.value
      }
      if(actor.deathDate){
        deathDate = actor.deathDate.value
      }
      if(actor.popularity){
        popularity = actor.popularity.value
      }
      if(actor.birthPlace){
        birthPlace = actor.birthPlace.value
      }
      if(actor.biography){
        biography = actor.biography.value
      }
      var movieList = actor.movies.value.split(",")

    return (
      <Container style={{textAlign: 'left'}}>
        <Button variant="outline-dark" style={{marginTop:"2.5%"}} onClick={showList}>
          Back to Movies
        </Button>

      <h1 style={{marginTop:"2.5%", fontSize:"4em", fontWeight:"bolder"}}>{actorName}</h1>
      <p style={{fontSize:"1.2em",marginBottom: "2%"}}>       
      {biography}
      </p>
      <Row style={{marginBottom:"2%"}}>
      <Col>
        <Image src={"https://image.tmdb.org/t/p/w500" + photo } rounded />
      </Col>            
       <Col style={{marginLeft:"2%", marginTop:"2%", fontSize:"1.5em"}}>

           <p><span style={{fontWeight: "bold"}}>Born: </span> {birthDate} in {birthPlace}</p>
           <p><span style={{fontWeight: "bold"}}>Died: </span> {deathDate}</p>
           <p><span style={{fontWeight: "bold"}}>Popularity: </span>{popularity}</p>
           <p><span style={{fontWeight: "bold"}}>Films: </span>
              {
                movieList && movieList.map(item => renderMovie(item))
              }
           </p>
       </Col>
      </Row>
      </Container>
  );}}

export default ActorDetail;
 
 


