import React, {useState, useEffect} from 'react'
import {Container, Dropdown, Row, Col, Form,Button, ButtonGroup} from "react-bootstrap";
import ControlledCarousel from './HomeCarousel'

function Filters({movies,filterMovie}) {
    const [filter, setFilter] = useState({rating:0, release:0, genre:[], name:"", movies:[]})

    useEffect(() => {
        var tempArr = []
        movies.map(item => tempArr.push(item.name.value))
        setFilter({...filter,movies:tempArr})
    },[])

    const handleOrder = (type, val) => {
        if(type == "rating"){
            setFilter({...filter, rating:val, release:0})
            filterMovie({...filter, rating:val, release:0})
        }else if(type == "release"){
            setFilter({...filter, rating:0, release:val})
            filterMovie({...filter, rating:0, release:val})
        }  
        
    }

    const handleGenres = (name) => {
        var itemIndex = filter.genre.indexOf(name)
        var tempArr = filter.genre

        if(itemIndex > -1){           
            tempArr.splice(itemIndex,1)
            setFilter({...filter, genre:tempArr})
            filterMovie({...filter, genre:tempArr})
        }else{
            setFilter({...filter, genre:[...filter.genre,name]})
            filterMovie({...filter, genre:[...filter.genre,name]})
        }       
    }

    const handleSearch = (e) => {
        var searchVal = e.target.value    
        setFilter({...filter, name:searchVal})       
    }

    const handlePressSearch = () => {
        filterMovie(filter)
    }

    var genres = ["Western", "War", "TvMovie", "Thriller", "ScienceFiction", 
    "Romance", "Mystery", "Music", "Horror", "History",
    "Fantasy", "Family", "Drama", "Documentary", "Crime",
    "Comedy", "Animation", "Adventure", "Action"]



    const renderSortByRating = () => {
        return (
            <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{minHeight:"50px", width:"75%", fontWeight:"bold", fontSize:"1.3em"}}>
                Sort by rating
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width:"75%"}}>
                <Dropdown.Item style={{fontWeight:"bold"}} onClick={() => handleOrder("rating",1)}>from highest to lowest rating</Dropdown.Item>
                <Dropdown.Item style={{fontWeight:"bold"}} onClick={() => handleOrder("rating",2)}>from lowest to highest rating</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        )
    }

    const renderSortByReleaseDate = () => {
        return (
            <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{minHeight:"50px", width:"75%", fontWeight:"bold", fontSize:"1.3em"}}>
                Sort by release date
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width:"75%"}}>
                <Dropdown.Item style={{fontWeight:"bold"}} onClick={() => handleOrder("release",1)}>from newest to oldest movie</Dropdown.Item>
                <Dropdown.Item style={{fontWeight:"bold"}} onClick={() => handleOrder("release",2)}>from oldest to newest movie</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        )
    }

    const renderGenreCheckbox = () => {
        return (
            <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{minHeight:"50px", width:"75%", fontWeight:"bold", fontSize:"1.3em"}}>
                Select genres
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width:"75%", fontWeight:"bold"}}>
                {genres.map((genre) => (
                <div key={genre} className="mb-3">
                    <Form.Check 
                    type="checkbox"
                    id={genre}
                    label={genre}
                    onClick = {() => handleGenres(genre)}
                    />
                </div>
                ))}
            </Dropdown.Menu>
            </Dropdown>

        )
    }

    return (
        <>
            <Row style={{margin:"2%", minHeight:"50px"}}>
                <Col md="3">
                    {renderSortByRating()}
                </Col >
                <Col md="3">
                    {renderSortByReleaseDate()}
                </Col>
                <Col md="3">
                    {renderGenreCheckbox()}
                </Col>
                <Col md="3">
                    <div className="input-group rounded">
                    <Form.Control style={{minHeight:"50px"}} list = "movieList" type="search" placeholder="Search films" onChange={(e) => handleSearch(e)} />
                    
                    <datalist id="movieList">
                        {
                            filter.movies.map(item => {return(<option value={item}/>)})
                        }
                    </datalist>
                    <Button variant="secondary" style={{fontWeight:"bold"}} onClick={()=>handlePressSearch()}>Search</Button>                    
                    </div>
                </Col>
            </Row>
        </>
    );
}
export default Filters;
