import React,{useState, useEffect} from 'react'
import {Row, Col, Container, Form, Button, Card, CardDeck} from "react-bootstrap";
import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";
import { createPortal } from 'react-dom/cjs/react-dom.development';


function MovieList({moviesStream, showMovie}) {
    const imageLink = "https://image.tmdb.org/t/p/w500";
    var tempArr = moviesStream
    
    const handleClick = (id) => {
        showMovie(id)
    }

    const renderCard = (movie) => {
        return(
            <Card style={{width:'20%', margin:'5px'}} key = {movie.subject.value}  id = {movie.subject.value} onClick={() => handleClick(movie.subject.value)}>
                <Card.Img variant="top" src={imageLink + movie.picture.value} />
                <Card.Body>
                    <Card.Title>{movie.name.value}</Card.Title>
                </Card.Body>
            </Card>     
        )
    }

    return (
        <Container  fluid>
            <Row className="justify-content-md-center">   
            {
                tempArr && tempArr.map((movie) => renderCard(movie))
            }
            </Row>   
      </Container>
    );
}

export default MovieList;
