import React from 'react'
import {Container, Row, Col,Image, Tooltip, OverlayTrigger,Button,Popover,Modal} from "react-bootstrap";

function Detail() {

    return (
        <Container>
        <h1 style={{marginTop:"2.5%", fontSize:"4em", fontWeight:"bolder"}}>Our Towns</h1>
        <p style={{marginLeft:"3%", fontSize:"1.5em", color: "grey"}}>
            Documentary
            &#9900;
            97 min.
        </p>
        <p style={{fontSize:"1.2em",marginBottom: "2%"}}>            
            A documentary that paints a remarkable picture of America and how the rise of civic and economic reinvention is transforming small cities and towns across the country. Based on journalists James and Deborah Fallows' book Our Towns: A 100,000-Mile Journey into the Heart of America, the film spotlights local initiatives and explores how a sense of community and common language of change can help people and towns find a different path to the future.         
        </p>
        <Row style={{marginBottom:"2%"}}>
        <Col>
        <Image src="https://image.tmdb.org/t/p/w500//yDtLlmNvjJ3GagL9zREZDJmpUX7.jpg" rounded />
        </Col>            
         <Col style={{marginLeft:"2%", marginTop:"2%", fontSize:"1.5em"}}>
             <p><span style={{fontWeight: "bold"}}>Country: </span> United States of America</p>
             <p><span style={{fontWeight: "bold"}}>Released in: </span>2021-04-13</p>
             <p><span style={{fontWeight: "bold"}}>Adult movie: </span>No</p>
             <p><span style={{fontWeight: "bold"}}>Director: </span>Steven Ascher</p>
             <p><span style={{fontWeight: "bold"}}>Actors: </span>
                <Button id="<http://sm.org/onto/Person/3030642>" style={{padding: "0",fontSize:"0.9em"}} variant="link"> Deborah Fallows</Button>,  
                <Button id="<http://sm.org/onto/Person/3030643>" style={{padding: "0",fontSize:"0.9em"}} variant="link"> James Fallows</Button>
             </p>
             <p><span style={{fontWeight: "bold"}}>Film studio: </span> 
                
                <OverlayTrigger key="<http://sm.org/onto/FilmStudio/14914>" placement="bottom"
                    overlay={
                        <Popover id={`<http://sm.org/onto/FilmStudio/14914>`}>
                        <Popover.Title as="h3">{`HBO Documentary Films`}</Popover.Title>
                        <Popover.Content>
                            <Image src="https://image.tmdb.org/t/p/w500/1RZBWz53SpHUTLpRcM8BGv2plIP.png" fluid rounded />
                            <p style={{marginTop: "4%"}}><span style={{fontWeight: "bold"}}>Country: </span> United States of America</p>
                        </Popover.Content>
                        </Popover>
                    }
                    >
                    <Button style={{padding: "0",fontSize:"0.9em"}} variant="link">HBO Documentary Films</Button>
                </OverlayTrigger> ,

                <OverlayTrigger key="<http://sm.org/onto/FilmStudio/87392>" placement="bottom"
                    overlay={
                        <Popover id={`<http://sm.org/onto/FilmStudio/87392>`}>
                        <Popover.Title as="h3">{`West City Films`}</Popover.Title>
                        <Popover.Content>
                            Unknown information.
                        </Popover.Content>
                        </Popover>
                    }
                    >
                    <Button style={{padding: "0",fontSize:"0.9em"}} variant="link">West City Films</Button>
                </OverlayTrigger>

             </p>
             <p><span style={{fontWeight: "bold"}}>Budget: </span> 0</p>
             <p><span style={{fontWeight: "bold"}}>Ranking: </span> 0.0</p>
             <p>
                 <span style={{fontWeight: "bold"}}>Homepage: </span><a href="https://www.hbo.com/documentaries/our-towns">www.hbo.com/documentaries/our-towns</a>
            </p>

         </Col>
        </Row>
        </Container>
    );
}
export default Detail;
